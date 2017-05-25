package at.rovo.textextraction.mss;

import at.rovo.classifier.naiveBayes.NaiveBayes;
import at.rovo.common.UrlReader;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.ParserUtil;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.textextraction.ExtractionException;
import at.rovo.textextraction.TextUtils;
import at.rovo.textextraction.TrainData;
import java.lang.invoke.MethodHandles;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class represents the supervised maximum subsequence segmentation approach presented by Jeff Pasternack and Dan
 * Roth in their paper on 'Extracting Article Text from the Web with Maximum Subsequence Segmentation' to predict the
 * main text of an article.
 * <p>
 * It therefore uses local naive Bayes classifiers which first has to be trained using the {@link
 * #initTrainingSamples(int)} method.
 * <p>
 * The training examples have to either be in a text-file (.txt) or in a SQLite database (ate.db) inside the
 * trainingData sub- directory of the project-root. Which of both methods of training should be used can be specified by
 * creating a new instance of this class and providing the appropriate {@link TrainData} argument.
 * <p>
 * For a text file learning approach, the first line has to contain the URL of the article, the second line has to
 * contain the classification of the article (f.e. news). The third line (till the end of the file) contains the HTML
 * code of the article's text from the first part (word or tag) till the last word or tag of the text.
 * <p>
 * The format of the database can be learned from http://cogcomp.cs.illinois.edu/Data/MSS/
 * <p>
 * After training has completed, main text of articles can be predicted via {@link #predictText(List)}.
 * <p>
 * It therefore builds a score-list for every local naive Bayes classifier and feeds this list into the maximum
 * subsequence segmentation algorithm to retrieve a local maximum subsequence.
 * <p>
 * The subsequence which value is highest is taken as predictor for the article text extraction.
 *
 * @author Roman Vottner
 */
public class SupervisedMSS extends MaximumSubsequenceSegmentation
{
    /** The LOG of this instance **/
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    /** The parser used to download the content from pages on the Internet **/
    private Parser parser = null;

    /**
     * Creates a new instance of a supervised maximum subsequence segmentation method
     *
     * @param trainForm
     *         Defines if training data should be taken from files, the SQLite ate.db or both
     */
    public SupervisedMSS(TrainData trainForm)
    {
        super(trainForm);

        this.parser = new Parser();
    }

    /**
     * Predicts article text based on local classifiers.
     * <p>
     * It therefore tries every classifier, out of which it is calculating a score list from and applies it to the
     * maximum subsequence segmentation algorithm to get a local score-value for the subsequence
     * <p>
     * The score-list which produces the highest value is taken as predictor for the article text.
     *
     * @return The predicted main content of a news article
     *
     * @throws ExtractionException
     *         if the URL to predict content from is either null or empty
     * @throws NotTrainedException
     *         if the instance was not yet trained
     * @throws NoSubsequenceFoundException
     *         if no subsequence could be found
     */
    @Override
    public String predictText(final String url) throws ExtractionException
    {
        UrlReader reader = new UrlReader();
        String html = reader.readPage(url);
        if (html == null || html.equals(""))
        {
            LOG.error("No html content available!");
            throw new ExtractionException("Page to predict content from is either null or empty");
        }

        if (!this.isTrained)
        {
            throw new NotTrainedException(
                    "The instance has not yet trained. " + "Please make sure to calculate initTrainingData() beforehand!");
        }

        List<Double> maxSS = new ArrayList<>();
        String classifierName;
        double maxVal;
        ParseResult parse = this.parser.tokenize(html, false);
        List<Token> htmlToken = parse.getParsedTokens();

        // Build a score-list for the classifier
        List<Double> score = this.buildScoreList(htmlToken, this.classifier);
        int start = this.topMaximumSubsequence(score, maxSS);
        if (maxSS.size() < 1)
        {
            throw new NoSubsequenceFoundException("No maximum sequence found!");
        }
        maxVal = this.value(maxSS);
        classifierName = this.classifier.getName();
        LOG.trace("Calculating MSS of {}: {}", classifierName, maxVal);

        // We actually found a subsequence with highest value in one of
        // our classifiers
        if (classifierName != null)
        {
            LOG.debug("Using classifier: {}", classifierName);
        }

        List<Token> predictedContent = this.getPredictedContent(htmlToken, maxSS, start);

        LOG.trace("title: {}", parse.getTitle());
        LOG.trace("author: {}", parse.getAuthors());
        LOG.trace("date: {}", parse.getPublishDate());

        LOG.trace("MSS: {}", maxSS);
        LOG.debug("Predicted Content: {}", predictedContent);

        // clean and format the text
        return TextUtils.formatText(this.cleanText(predictedContent));
    }

    @Override
    public List<String> predictText(final List<String> urls) throws ExtractionException
    {
        List<String> predictedContent = new ArrayList<>();
        for (String url : urls)
        {
            predictedContent.add(this.predictText(url));
        }
        return predictedContent;
    }

    /**
     * Extracts the source URL from the origin URL
     *
     * @param url
     *         The origin URL
     *
     * @return The source URL
     */
    protected String extractSourceUrlFromUrl(String url)
    {
        url = url.replace("http://", "");
        url = url.substring(0, url.indexOf("/"));
        if (url.startsWith("www."))
        {
            url = url.replace("www.", "");
        }
        return url;
    }

    /**
     * Extracts the predicted article content from the HTML page
     *
     * @param html
     *         A {@link List} containing all {@link Token}s of the origin page
     * @param maxSS
     *         The predicted result of the maximum subsequence segmentation algorithm
     * @param start
     *         The start position based on the prediction of the MSS algorithm
     *
     * @return The predicted text as a {@link List} of {@link Token}s
     */
    protected List<Token> getPredictedContent(List<Token> html, List<Double> maxSS, int start)
    {
        List<Token> text = new ArrayList<>();
        if (start + maxSS.size() + 1 <= html.size())
        {
            for (int j = start; j <= start + maxSS.size() + 1; j++)
            {
                text.add(html.get(j));
            }
        }
        else
        {
            for (int j = start; j <= start + maxSS.size(); j++)
            {
                text.add(html.get(j));
            }
        }
        return text;
    }

    /**
     * Builds a score-list based on the probabilities of the local classifier for every token to be labeled as in - 0.5
     * to generate values between -0.5 and 0.5
     *
     * @param html
     *         {@link List} of {@link Token}s which represent the HTML page whose main article text should be predicted
     * @param classifier
     *         The local classifier used
     *
     * @return A {@link List} of scores
     */
    protected List<Double> buildScoreList(List<Token> html, NaiveBayes<String, String> classifier)
    {
        List<Double> scoreList = new ArrayList<>();
        LOG.trace("Score-List:");
        int start = 0;
        if (TrainFeatureStrategy.BIGRAM.equals(this.trainFeatureStrategy) ||
            TrainFeatureStrategy.DOUBLE_UNIGRAM.equals(this.trainFeatureStrategy))
        {
            start = 1;
        }
        else if (TrainFeatureStrategy.TRIGRAM.equals(this.trainFeatureStrategy) ||
                 TrainFeatureStrategy.TRIPLE_UNIGRAM.equals(this.trainFeatureStrategy))
        {
            start = 2;
        }

        Token token1 = null;
        Token token2 = null;
        for (int i = 0; i < html.size(); i++)
        {
            Token token = html.get(i);
            double score = 0.;
            // build an n-gram for the token and look up the probability for
            // this n-gram
            if (i >= start)
            {
                if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.TRIGRAM))
                {
                    score = classifier.getProbability("in", this.getTrigram(token1, token2, token)) - 0.5;
                }
                else if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.BIGRAM))
                {
                    score = classifier.getProbability("in", this.getBigram(token2, token)) - 0.5;
                }
                else if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.UNIGRAM))
                {
                    score = classifier.getProbability("in", this.getUnigram(token)) - 0.5;
                }
                else if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.DOUBLE_UNIGRAM))
                {
                    score = classifier.getProbability("in", this.getDoubleUnigram(token2, token)) - 0.5;
                }
                else if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.TRIPLE_UNIGRAM))
                {
                    score = classifier.getProbability("in", this.getTripleUnigram(token1, token2, token)) - 0.5;
                }

                LOG.trace("{}{} : {}", (score < 0 ? "" : " "), new DecimalFormat("#0.000").format(score),
                          (token.getText() != null ? token.getText() : token.getHTML()));
                scoreList.add(score);
            }
            token1 = token2;
            token2 = token;
        }
        return scoreList;
    }

    /**
     * Builds a triple unigram out of three tokens
     *
     * @param t1
     *         First token of a triple unigram
     * @param t2
     *         Second token of a triple unigram
     * @param t3
     *         Third token of a triple unigram
     *
     * @return The triple unigram of the provided tokens
     */
    protected String[] getTripleUnigram(Token t1, Token t2, Token t3)
    {
        String[] unigram = new String[3];
        if (t1 instanceof Word)
        {
            unigram[0] = ParserUtil.formatText(t1.getText());
        }
        else
        {
            unigram[0] = t1.getHTML();
        }

        if (t2 instanceof Word)
        {
            unigram[1] = ParserUtil.formatText(t2.getText());
        }
        else
        {
            unigram[1] = t2.getHTML();
        }

        if (t3 instanceof Word)
        {
            unigram[2] = ParserUtil.formatText(t3.getText());
        }
        else
        {
            unigram[2] = t3.getHTML();
        }

        LOG.trace("Triple-Unigram: {}", Arrays.toString(unigram));
        return unigram;
    }

    /**
     * Builds a double unigram out of two tokens
     *
     * @param t1
     *         First token of a double unigram
     * @param t2
     *         Second token of a double unigram
     *
     * @return The double unigram of the provided tokens
     */
    protected String[] getDoubleUnigram(Token t1, Token t2)
    {
        String[] unigram = new String[2];
        if (t1 instanceof Word)
        {
            unigram[0] = ParserUtil.formatText(t1.getText());
        }
        else
        {
            unigram[0] = t1.getHTML();
        }

        if (t2 instanceof Word)
        {
            unigram[1] = ParserUtil.formatText(t2.getText());
        }
        else
        {
            unigram[1] = t2.getHTML();
        }

        LOG.trace("Double-Unigram: {}", Arrays.toString(unigram));
        return unigram;
    }

    /**
     * Build a unigram out of a token
     *
     * @param t1
     *         The token of the unigram
     *
     * @return The unigram of the provided token
     */
    protected String getUnigram(Token t1)
    {
        String unigram;
        if (t1 instanceof Word)
        {
            unigram = ParserUtil.formatText(t1.getText());
        }
        else
        {
            unigram = t1.getHTML();
        }

        LOG.trace("Unigram: {}", unigram);
        return unigram;
    }

    /**
     * Builds a bigram out of two tokens
     *
     * @param t1
     *         First token of a bigram
     * @param t2
     *         Second token of a bigram
     *
     * @return The bigram of the provided tokens
     */
    protected String getBigram(Token t1, Token t2)
    {
        String bigram;
        if (t1 instanceof Word)
        {
            bigram = ParserUtil.formatText(t1.getText());
        }
        else
        {
            bigram = t1.getHTML();
        }

        if (t2 instanceof Word)
        {
            bigram += " " + ParserUtil.formatText(t2.getText());
        }
        else
        {
            bigram += " " + t2.getHTML();
        }

        LOG.trace("Bigram: {}", bigram);
        return bigram;
    }

    /**
     * Builds a trigram out of three tokens
     *
     * @param t1
     *         First token of a trigram
     * @param t2
     *         Second token of a trigram
     * @param t3
     *         Third token of a trigram
     *
     * @return The trigram of the provided tokens
     */
    protected String getTrigram(Token t1, Token t2, Token t3)
    {
        String trigram;
        if (t1 instanceof Word)
        {
            trigram = ParserUtil.formatText(t1.getText());
        }
        else
        {
            trigram = t1.getHTML();
        }

        if (t2 instanceof Word)
        {
            trigram += " " + ParserUtil.formatText(t2.getText());
        }
        else
        {
            trigram += " " + t2.getHTML();
        }

        if (t3 instanceof Word)
        {
            trigram += " " + ParserUtil.formatText(t3.getText());
        }
        else
        {
            trigram += " " + t3.getHTML();
        }

        LOG.trace("Trigram: {}", trigram);
        return trigram;
    }
}
