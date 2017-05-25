package at.rovo.textextraction.mss;

import at.rovo.classifier.naiveBayes.NaiveBayes;
import at.rovo.parser.Token;
import at.rovo.textextraction.ExtractionException;
import at.rovo.textextraction.TextExtractor;
import at.rovo.textextraction.TextUtils;
import at.rovo.textextraction.TrainData;
import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class is the base class for every maximum subsequence segmentation (MSS) algorithm.
 * <p>
 * It provides the actual linear time cost implementation of the MSS algorithm as presented by Jeff Pasternack and Dan
 * Roth in their paper 'Extracting Article Text from the Web with Maximum Subsequence Segmentation' as well as the
 * original algorithm presented by Walter Ruzzo and Martin Tompa in their paper 'A linear time algorithm for finding all
 * maximal scoring subsequences'.
 * <p>
 * Extending classes have to implement {@link #predictText(List)}
 *
 * @author Roman Vottner
 */
public abstract class MaximumSubsequenceSegmentation extends TextExtractor
{
    /** The LOG of this class **/
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    /**
     * Provides basic initialization for extending classes
     */
    public MaximumSubsequenceSegmentation()
    {
        super();
        this.classifier = NaiveBayes.create(this.probCalc, this.storageMethod);
    }

    /**
     * Provides basic initialization for extending classes
     *
     * @param trainFrom
     *         Defines if training data should be taken from files, the SQLite ate.db or both
     */
    public MaximumSubsequenceSegmentation(final TrainData trainFrom)
    {
        super();
        this.classifier = NaiveBayes.create(this.probCalc, this.storageMethod);
        this.trainFrom = trainFrom;
    }

    /**
     * Represents the algorithm presented by Jeff Pasternack and Dan Roth which finds the subsequence with the highest
     * score in a provided {@link List} within linear time.
     *
     * @param s
     *         A {@link List} of {@link Double} values representing a score out of which a subsequence should be
     *         extracted that produces a highest score
     * @param maxSS
     *         An empty {@link List} should be provided, this {@link List} will contain the maximum subsequence after
     *         the call
     *
     * @return The starting index of the subsequence based on it's position in s
     */
    public int topMaximumSubsequence(final List<Double> s, List<Double> maxSS)
    {
        int start = 0;
        double sum = 0;
        maxSS.clear();
        maxSS.add(Double.NEGATIVE_INFINITY);
        int maxStart = 0;

        for (int i = 0; i < s.size(); i++)
        {
            sum = sum + s.get(i);
            if (sum > value(maxSS))
            {
                maxSS.clear();
                maxStart = start;
                for (int j = start; j <= i; j++)
                {
                    maxSS.add(s.get(j));
                }
            }
            if (sum < 0)
            {
                start = i + 1;
                sum = 0;
            }
        }
        // LOG.debug("Maximum subsequence: {}", maxSS);
        LOG.debug("Start at: {}, length: {}", maxStart, maxSS.size());
        return maxStart;
    }

    /**
     * Calls the original version of the algorithm and returns only the most interesting parameters.
     * <p>
     * The {@link List} with all subsequences is returned via parameter reference while the start positions of every
     * subsequence relating to their position in the origin list is returned as an array via the methods return method.
     *
     * @param S
     *         A {@link List} of {@link Double} values representing a score out of which a subsequence should be
     *         extracted that produces a highest score
     * @param kSS
     *         An empty {@link List} should be provided, this {@link List} will contain the k best non-overlapping
     *         subsequence in a further {@link List} after the call
     *
     * @return The start positions of each subsequence
     */
    public int[] kMaximumSubsequenes(final List<Double> S, List<List<Double>> kSS)
    {
        List<Integer> startPos = new ArrayList<>();
        this.kMaximumSubsequences(S, kSS, new ArrayList<>(), new ArrayList<>(), startPos);
        // copy startPos entries to int[]
        int[] ret = new int[startPos.size()];
        for (int i = 0; i < startPos.size(); i++)
        {
            ret[i] = startPos.get(i);
        }
        return ret;
    }

    /**
     * Implements the maximal scoring subsequences algorithm as proposed by Walter Ruzzo and Martin Tompa in their paper
     * 'A linear time algorithm for finding all maximal scoring subsequences'
     * <p>
     * This methods takes a parameter S which contains the original sequence and returns a {@link List} via
     * object-reference (Parameter I) with all subsequences which are further organized in a {@link List}. Moreover the
     * score from sequence-start up to but not including the position of the subsequence is returned via object
     * reference in parameter L and the score including the subsequence score is returned via parameter R. Furthermore
     * the start positions in the original sequence of every subsequence found is returned via the startPos parameter.
     * <p>
     * Note that the content of the last three parameters does get cleared if there is one.
     *
     * @param S
     *         The sequence where subsequences should get extracted
     * @param I
     *         Certain ordered list of disjoint subsequences
     * @param L
     *         cumulative total of Ii of all scores up to but not including the leftmost score of Ij
     * @param R
     *         List of the total score up the the specific element
     * @param startPos
     *         Returns the start position of every subsequence found in the original list
     *
     * @return The total score of the sequence
     */
    public double kMaximumSubsequences(final List<Double> S, List<List<Double>> I, List<Double> L, List<Double> R,
                                       List<Integer> startPos)
    {
        if (S == null)
        {
            throw new IllegalArgumentException("No sequence available to trace for subsequences!");
        }
        if (I == null || L == null || R == null || startPos == null)
        {
            throw new IllegalArgumentException("A parameter required to return the results is null!");
        }
        /*
         * The algorithm proposed by Walter Ruzzo and Martin Tompa works as follows:
         * 1. the list is search from right to left for the maximum value of j satisfying Lj < Lk
         * 2. If there is no such j, then add Ik to the end of the list.
         * 3. If there is such a j, and Rj >= Rk, then add Ik to the end of the list
         * 4. Otherwise (i,e. there is such a j, but Rj < Rk), extend the subsequence Ik to the left to encompass
         *    everything up to and including the leftmost score in Ij. Delete subsequences Ij, Ij+1, ... Ik-1 from the
         *    list (none of them is maximal) and reconsider the newly extended subsequence Ik (now renumbered Ij) as in
         *    step 1.
         */
        double cumulativeTotal = 0.;
        // The list is initially empty
        I.clear();
        L.clear();
        R.clear();
        startPos.clear();
        for (int i = 0; i < S.size(); i++)
        {
            // a non-positive score requires no special processing
            if (S.get(i) > 0)
            // a positive score is incorporated into a new subsequence Ik of length one
            {
                this.applySteps(i, cumulativeTotal, S, I, L, R, startPos, false);
            }
            cumulativeTotal += S.get(i);
        }

        LOG.trace("I: {}", I);
        LOG.trace("L: {}", L);
        LOG.trace("R: {}", R);
        LOG.trace("startPos: {}", startPos);

        return cumulativeTotal;
    }

    /**
     * Implements the 4 steps introduced by Walter Ruzzo and Martin Tompa. This is necessary as the 4th step calls this
     * method again without reading the next part of the input sequence.
     *
     * @param i
     *         Current position in the origin sequence
     * @param cumulativeTotal
     *         Sum of all elements from the start to but not including the i'th element
     * @param S
     *         The origin sequence
     * @param I
     *         A {@link List} of all found subsequences up to the i'th element
     * @param L
     *         The cumulative values before the corresponding subsequence
     * @param R
     *         The cumulative values after the corresponding subsequence
     * @param startPos
     *         The start position in the origin sequence of a subsequence
     * @param append
     *         Decides if this method should consider the next value of the origin sequence (append == false) or use the
     *         latest subsequence for further processing
     */
    private void applySteps(int i, double cumulativeTotal, List<Double> S, List<List<Double>> I, List<Double> L,
                            List<Double> R, List<Integer> startPos, boolean append)
    {
        List<Double> Ik = new ArrayList<>();
        Ik.add(S.get(i));
        Double Lk, Rk;
        if (!append)
        {
            Lk = cumulativeTotal;
            Rk = Lk + S.get(i);
        }
        else
        {
            Lk = L.get(L.size() - 1);
            Rk = R.get(R.size() - 1);
        }
        int k = I.size();
        // that is then integrated into the list by the following process
        // 1. The List is searched from right to left for the maximum value of j satisfying Lj < Lk
        int j;
        for (j = k; j > 0; j--)
        {
            if (L.get(j - 1) < Lk)
            {
                break;
            }
        }
        // 2. If there is no such j, then add Ik to the end of the list
        if (j == 0 && !append)
        {
            I.add(Ik);
            L.add(Lk);
            R.add(Rk);
            startPos.add(i);
        }
        // 3. If there is such a j, and Rj >= Rk, then add Ik to the end of the list
        else if (j > 0 && R.get(j - 1) >= Rk && !append)
        {
            I.add(Ik);
            L.add(Lk);
            R.add(Rk);
            startPos.add(i);
        }
        // 4. Otherwise (i.e., there is such a j, but Rj < Rk), extend the subsequence Ik to the left to encompass
        //    everything up to and including the leftmost score in Ij. Delete subsequences Ij, Ij+1, ..., Ik-1 from the
        //    list (none of them is maximal) and reconsider the newly extended subsequence Ik (new renumbered Ij) as in
        //    step 1.
        else
        {
            // join Ij to Ik
            // as negative values might belong to the subsequence add everything from the start position of Ij + its
            // length till the end of S(i) and remove every entry j+1 in I, L, R and startPos
            if (j - 1 < 0)
            {
                return;
            }
            int pos = startPos.get(j - 1);
            for (int p = pos + I.get(j - 1).size(); p <= i; p++)
            {
                I.get(j - 1).add(S.get(p));
            }
            for (int p = j; p < I.size(); p++)
            {
                I.remove(p);
                L.remove(p);
                R.remove(p);
                startPos.remove(p);
            }
            // set Rj to the value of Rk
            R.set(j - 1, Rk);

            this.applySteps(i, L.get(j - 1), S, I, L, R, startPos, true);
        }
    }

    /**
     * Calculates the value of the sequence by summing up all its elements
     *
     * @param seq
     *         The sequence whose value should get calculated
     *
     * @return The sum of all the sequence's elements
     */
    protected double value(final List<Double> seq)
    {
        double sum = 0;
        for (Double d : seq)
        {
            sum += d;
        }
        return sum;
    }

    /**
     * Predicts the main content of the HTML page
     *
     * @param url
     *         The URL of the page to predict content from
     *
     * @return A {@link List} of the predicted main content
     *
     * @throws ExtractionException
     *         If an error occurs during the text prediction
     */
    public abstract String predictText(final String url) throws ExtractionException;

    /**
     * Predicts the main content of the provided HTML pages
     *
     * @param urls
     *         The URLs of the pages to predict content from
     *
     * @return A {@link List} of the predicted contents for the provided pages
     *
     * @throws ExtractionException
     *         If an error occurs during the text prediction
     */
    public abstract List<String> predictText(final List<String> urls) throws ExtractionException;

    /**
     * Cleans the extracted blocks as proposed by Jeff Pasternack and Dan Roth in their paper on 'Extracting article
     * text from the web with maximum subsequence segmentation'.
     *
     * @param text
     *         The extracted text from a web page via the {@link #topMaximumSubsequence(List, List)} method
     *
     * @return The cleaned text
     */
    @Override
    public List<Token> cleanText(List<Token> text)
    {
        return TextUtils.cleanText(text, commonTags);
    }
}
