package at.rovo.textextraction.mss;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import at.rovo.classifier.naiveBayes.NaiveBayes;
import at.rovo.classifier.naiveBayes.ProbabilityCalculation;
import at.rovo.classifier.naiveBayes.TrainingDataStorageMethod;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.textextraction.ExtractionException;
import at.rovo.textextraction.TextExtractor;
import at.rovo.textextraction.TrainData;

/**
 * <p>
 * This class is the base class for every maximum subsequence segmentation (MSS)
 * algorithm.
 * </p>
 * <p>
 * It provides the actual linear time cost implementation of the MSS algorithm
 * as presented by Jeff Pasternack and Dan Roth in their paper 'Extracting
 * Article Text from the Web with Maximum Subsequence Segmentation' as well as
 * the original algorithm presented by Walter Ruzzo and Martin Tompa in their
 * paper 'A linear time algorithm for finding all maximal scoring subsequences'.
 * </p>
 * <p>
 * Extending classes have to implement {@link #predictText(List)}
 * </p>
 * 
 * @author Roman Vottner
 */
public abstract class MaximumSubsequenceSegmentation extends TextExtractor
{
	/** The logger of this class **/
	private static Logger logger = LogManager.getLogger(MaximumSubsequenceSegmentation.class);

	/**
	 * <p>
	 * Provides basic initialization for extending classes
	 * </p>
	 */
	public MaximumSubsequenceSegmentation()
	{
		super();
		this.classifier = NaiveBayes.create(
				ProbabilityCalculation.EVEN_LIKELIHOOD,
				TrainingDataStorageMethod.MAP);
	}

	/**
	 * <p>
	 * Provides basic initialization for extending classes
	 * </p>
	 * 
	 * @param trainForm
	 *            Defines if training data should be taken from files, the
	 *            SQLite ate.db or both
	 */
	public MaximumSubsequenceSegmentation(final TrainData trainFrom)
	{
		super();
		this.classifier = NaiveBayes.create(
				ProbabilityCalculation.EVEN_LIKELIHOOD,
				TrainingDataStorageMethod.MAP);
		this.trainFrom = trainFrom;
	}

	/**
	 * Represents the algorithm presented by Jeff Pasternack and Dan Roth which
	 * finds the subsequence with the highest score in a provided {@link List}
	 * within linear time.
	 * 
	 * @param s
	 *            A {@link List} of {@link Double} values representing a score
	 *            out of which a subsequence should be extracted that produces a
	 *            highest score
	 * @param maxSS
	 *            An empty {@link List} should be provided, this {@link List}
	 *            will contain the maximum subsequence after the call
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
					maxSS.add(s.get(j));
			}
			if (sum < 0)
			{
				start = i + 1;
				sum = 0;
			}
		}
		// logger.debug("Maximum subsequence: {}", maxSS);
		logger.debug("Start at: {}, length: {}", maxStart, maxSS.size());
		return maxStart;
	}

	/**
	 * <p>
	 * Calls the original version of the algorithm and returns only the most
	 * interesting parameters.
	 * </p>
	 * <p>
	 * The {@link List} with all subsequences is returned via parameter
	 * reference while the start positions of every subsequence relating to
	 * their position in the origin list is returned as an array via the methods
	 * return method.
	 * </p>
	 * 
	 * @param S
	 *            A {@link List} of {@link Double} values representing a score
	 *            out of which a subsequence should be extracted that produces a
	 *            highest score
	 * @param kSS
	 *            An empty {@link List} should be provided, this {@link List}
	 *            will contain the k best non-overlapping subsequence in a
	 *            further {@link List} after the call
	 * @return The start positions of each subsequence
	 */
	public int[] kMaximumSubsequenes(final List<Double> S,
			List<List<Double>> kSS)
	{
		List<Integer> startPos = new ArrayList<Integer>();
		this.kMaximumSubsequences(S, kSS, new ArrayList<Double>(),
				new ArrayList<Double>(), startPos);
		// copy startPos entries to int[]
		int[] ret = new int[startPos.size()];
		for (int i = 0; i < startPos.size(); i++)
			ret[i] = startPos.get(i);
		return ret;
	}

	/**
	 * <p>
	 * Implements the maximal scoring subsequences algorithm as proposed by
	 * Walter Ruzzo and Martin Tompa in their paper 'A linear time algorithm for
	 * finding all maximal scoring subsequences'
	 * </p>
	 * <p>
	 * This methods takes a parameter S which contains the original sequence and
	 * returns a {@link List} via object-reference (Parameter I) with all
	 * subsequences which are further organized in a {@link List}. Moreover the
	 * score from sequence-start up to but not including the position of the
	 * subsequence is returned via object reference in parameter L and the score
	 * including the subsequence score is returned via parameter R. Furthermore
	 * the start positions in the original sequence of every subsequence found
	 * is returned via the startPos parameter.
	 * </p>
	 * <p>
	 * Note that the content of the last three parameters does get cleared if
	 * there is one.
	 * </p>
	 * 
	 * @param S
	 *            The sequence where subsequences should get extracted
	 * @param I
	 *            Certain ordered list of disjoint subsequences
	 * @param L
	 *            cumulative total of Ii of all scores up to but not including
	 *            the leftmost score of Ij
	 * @param R
	 *            List of the total score up the the specific element
	 * @param startPos
	 *            Returns the start position of every subsequence found in the
	 *            original list
	 * @return The total score of the sequence
	 */
	public double kMaximumSubsequences(final List<Double> S,
			List<List<Double>> I, List<Double> L, List<Double> R,
			List<Integer> startPos)
	{
		if (S == null)
			throw new IllegalArgumentException(
					"No sequence available to trace for subsequences!");
		if (I == null || L == null || R == null || startPos == null)
			throw new IllegalArgumentException(
					"A parameter required to return the results is null!");
		/*
		 * The algorithm proposed by Walter Ruzzo and Martin Tompa works as
		 * follows: 1. the list is search from right to left for the maximum
		 * value of j satisfying Lj < Lk 2. If there is no such j, then add Ik
		 * to the end of the list. 3. If there is such a j, and Rj >= Rk, then
		 * add Ik to the end of the list 4. Otherwise (i,e. there is such a j,
		 * but Rj < Rk), extend the subsequence Ik to the left to encompass
		 * everything up to and including the leftmost score in Ij. Delete
		 * subsequences Ij, Ij+1, ... Ik-1 from the list (none of them is
		 * maximal) and reconsider the newly extended subsequence Ik (now
		 * renumbered Ij) as in step 1.
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
				// a positive score is incorporated into a new subsequence Ik of
				// length one
				this.applySteps(i, cumulativeTotal, S, I, L, R, startPos, false);
			cumulativeTotal += S.get(i);
		}
		
		logger.trace("I: {}", I);
		logger.trace("L: {}", L);
		logger.trace("R: {}", R);
		logger.trace("startPos: {}", startPos);

		return cumulativeTotal;
	}

	/**
	 * <p>
	 * Implements the 4 steps introduced by Walter Ruzzo and Martin Tompa. This
	 * is necessary as the 4th step calls this method again without reading the
	 * next part of the input sequence.
	 * </p>
	 * 
	 * @param i
	 *            Current position in the origin sequence
	 * @param cumulativeTotal
	 *            Sum of all elements from the start to but not including the
	 *            i'th element
	 * @param S
	 *            The origin sequence
	 * @param I
	 *            A {@link List} of all found subsequences up to the i'th
	 *            element
	 * @param L
	 *            The cumulative values before the corresponding subsequence
	 * @param R
	 *            The cumulative values after the corresponding subsequence
	 * @param startPos
	 *            The start position in the origin sequence of a subsequence
	 * @param append
	 *            Decides if this method should consider the next value of the
	 *            origin sequence (append == false) or use the latest
	 *            subsequence for further processing
	 */
	private void applySteps(int i, double cumulativeTotal, List<Double> S,
			List<List<Double>> I, List<Double> L, List<Double> R,
			List<Integer> startPos, boolean append)
	{
		List<Double> Ik = new ArrayList<Double>();
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
		// 1. The List is searched from right to left for the maximum value of j
		// satisfying Lj < Lk
		int j;
		for (j = k; j > 0; j--)
			if (L.get(j - 1) < Lk)
				break;
		// 2. If there is no such j, then add Ik to the end of the list
		if (j == 0 && !append)
		{
			I.add(Ik);
			L.add(Lk);
			R.add(Rk);
			startPos.add(i);
		}
		// 3. If there is such a j, and Rj >= Rk, then add Ik to the end of the
		// list
		else if (j > 0 && R.get(j - 1) >= Rk && !append)
		{
			I.add(Ik);
			L.add(Lk);
			R.add(Rk);
			startPos.add(i);
		}
		// 4. Otherwise (i.e., there is such a j, but Rj < Rk), extend the
		// subsequence Ik
		// to the left to encompass everything up to and including the leftmost
		// score in Ij.
		// Delete subsequences Ij, Ij+1, ..., Ik-1 from the list (none of them
		// is maximal)
		// and reconsider the newly extended subsequence Ik (new renumbered Ij)
		// as in step 1.
		else
		{
			// join Ij to Ik
			// as negative values might belong to the subsequence
			// add everything from the start position of Ij + its
			// length till the end of S(i)
			// and remove every entry j+1 in I, L, R and startPos
			if (j - 1 < 0)
				return;
			int pos = startPos.get(j - 1);
			for (int p = pos + I.get(j - 1).size(); p <= i; p++)
				I.get(j - 1).add(S.get(p));
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
	 *            The sequence whose value should get calculated
	 * @return The sum of all the sequence's elements
	 */
	protected double value(final List<Double> seq)
	{
		double sum = 0;
		for (Double d : seq)
			sum += d;
		return sum;
	}

	/**
	 * <p>
	 * Predicts the main content of the HTML page
	 * </p>
	 * 
	 * @param url
	 *            The URL of the page to predict content from
	 * @return A {@link List} of the predicted main content
	 * @throws Throws
	 *             an {@link ExtractionException} if an error occurs during the
	 *             text prediction
	 */
	public abstract String predictText(final String url)
			throws ExtractionException;

	/**
	 * <p>
	 * Predicts the main content of the provided HTML pages
	 * </p>
	 * 
	 * @param urls
	 *            The URLs of the pages to predict content from
	 * @return A {@link List} of the predicted contents for the provided pages
	 * @throws Throws
	 *             an {@link ExtractionException} if an error occurs during the
	 *             text prediction
	 */
	public abstract List<String> predictText(final List<String> urls)
			throws ExtractionException;

	/**
	 * <p>
	 * Cleans the extracted blocks as proposed by Jeff Pasternack and Dan Roth
	 * in their paper on 'Extracting article text from the web with maximum
	 * subsequence segmentation'.
	 * </p>
	 * 
	 * @param text
	 *            The extracted text from a web page via the
	 *            {@link #topMaximumSubsequence(List, List)} method
	 * @param renameUncommonTags
	 *            Specifies if tags which aren't included in the common tags
	 *            should be renamed to "unknown"
	 * @return The cleaned text
	 */
	@Override
	public List<Token> cleanText(List<Token> text)
	{
		Stack<List<Token>> tagStack = new Stack<List<Token>>();
		// add a root-level to the stack
		tagStack.push(new ArrayList<Token>());
		List<Token> cleaned = new ArrayList<Token>();
		for (Token token : text)
		{
			// we have found a tag - when it is a starting tag add a new
			// sequence to the stack
			// a closing tag should result in taking away the whole sequence
			// (from start to end
			// tag) from the stack
			// if the tag is an image or break symbol add it to the parent
			if (token instanceof Tag)
			{
				Tag tag = (Tag) token;
				// ignore comments
				if (tag.isComment())
					continue;

				// check if tag is in common tags
				List<String> sources = this.commonTags.get(tag.getShortTag());
				if (sources != null && sources.size() < 2)
					tag.setAsUndefined();

				// add <IMG> and <BR> tags in case they are not self-closed to
				// the parent tag
				if (tag.isOpeningTag() && tag.getShortTag().equals("img")
						|| tag.getShortTag().equals("br")
						&& !tag.isInlineCloseingTag())
				{
					// ignore images and line-breaks --> no content to analyze
					// tagStack.peek().add(tag);
				}
				// push a new token list on the stack to fill it with elements
				else if (tag.isOpeningTag())
				{
					if (!tag.isInlineCloseingTag())
					{
						List<Token> subElement = new ArrayList<Token>();
						subElement.add(tag);
						tagStack.push(subElement);
					}
				}
				// closing tag found - take it from the stack and decide based
				// on its content
				// if the tag should be kept or thrown away
				else
				{
					if (tagStack.isEmpty())
						continue;
					tagStack.peek().add(token);
					// as the first part of a sequence could be a word which
					// is followed by a closing tag - ignore that case
					Tag start = null;
					for (int i = 0; i < tagStack.peek().size(); i++)
					{
						Token _start = tagStack.peek().get(i);
						if (_start instanceof Tag && _start != token)
						{
							start = (Tag) _start;
							break;
						}
					}
					if (start == null)
						continue;

					// closing tag equals the starting tag
					if (tag.getShortTag().equals(start.getShortTag()))
					{
						// remove the contents of any <IFRAME> or <TABLE> tag
						// pair
						if (start.getShortTag().equals("table")
								|| start.getShortTag().equals("iframe")
								|| start.getShortTag().equals("form")
								|| start.getShortTag().equals("style")
								|| start.getShortTag().equals("script")
								|| start.getShortTag().equals("fb")
								|| start.getShortTag().equals("g")
								|| start.getShortTag().equals("blockquote")
								|| start.getShortTag().equals("cite")) // ||
																		// start.getShortTag().equals("unknown"))
							tagStack.pop();
						// remove empty tags
						else if (tagStack.peek().size() == 2)
							tagStack.pop();
						// remove links that do not link to other pages
						// else if (start.getShortTag().equals("a") &&
						// !start.getHTML().contains("href=\"http://"))
						// tagStack.pop();
						// remove li tags that only contain a link
						else if (start.getShortTag().equals("li"))
						{
							boolean remove = false;
							if (tagStack.peek().size() > 3
									&& tagStack.peek().get(0).getHTML()
											.startsWith("<li")
									&& tagStack.peek().get(1).getHTML()
											.startsWith("<a ")
									&& tagStack.peek().get(
											tagStack.peek().size() - 2)
											.getHTML().startsWith("</a")
									&& tagStack.peek().get(
											tagStack.peek().size() - 1)
											.getHTML().startsWith("</li"))
								remove = true;

							if (remove == true)
								tagStack.pop();
							else
								// if not, append the li-tag to its parent tag
								for (Token t : tagStack.pop())
								{
									if (tagStack.isEmpty())
										tagStack.push(new ArrayList<Token>());
									tagStack.peek().add(t);
								}
						}
						// remove p tags that only contain a link
						else if (start.getShortTag().equals("p"))
						{
							boolean remove = false;
							if (tagStack.peek().size() > 3
									&& tagStack.peek().get(0).getHTML()
											.startsWith("<p")
									&& tagStack.peek().get(1).getHTML()
											.startsWith("<a ")
									&& tagStack.peek().get(
											tagStack.peek().size() - 2)
											.getHTML().startsWith("</a")
									&& tagStack.peek().get(
											tagStack.peek().size() - 1)
											.getHTML().startsWith("</p"))
								remove = true;

							if (remove == true)
								tagStack.pop();
							else
								// if not, append the p-tag to its parent tag
								for (Token t : tagStack.pop())
								{
									if (tagStack.isEmpty())
										tagStack.push(new ArrayList<Token>());
									tagStack.peek().add(t);
								}
						}
						// remove the contents of any <DIV> tag pair ...
						else if (start.getShortTag().equals("div"))
						{
							// only <div..> and </div> element - can be removed
							if (tagStack.peek().size() == 2)
							{
								tagStack.pop();
								continue;
							}
							// more elements have been found inside the <div>
							// tags
							// look if there is a unwanted element inside the
							// <div> tag
							boolean delete = false;
							for (Token t : tagStack.peek())
							{
								if (t instanceof Tag)
								{
									Tag _tag = (Tag) t;
									// ... that contains a hyperlink (<A>) ...
									if (// _tag.getShortTag().equals("a") ||
										// ... <IFRAME> ...
									_tag.getShortTag().equals("iframe")
											||
											// ... <TABLE> ...
											_tag.getShortTag().equals("table")
											||
											// ... <IMG> ...
											// _tag.getShortTag().equals("img")
											// ||
											// ... <EMBED> ...
											_tag.getShortTag().equals("embed")
											||
											// ... <APPLET> ...
											_tag.getShortTag().equals("applet")
											||
											// ... or <OBJECT>
											_tag.getShortTag().equals("object"))
									{
										delete = true;
										break;
									}
								}
							}
							// we found a link/iframe/table/img/embed/applet or
							// object tag inside a div-tag
							// remove the whole div-tag
							if (delete == true)
								tagStack.pop();
							else
							{
								// check if the div-tag contains a p-element
								List<Token> divTokens = tagStack.peek();
								boolean found = false;
								for (Token t : divTokens)
								{
									if (t instanceof Tag)
									{
										Tag _tag = (Tag) t;
										if (_tag.getShortTag().equals("p"))
										{
											found = true;
											break;
										}
									}
								}
								// only add div-tags to the previous elements if
								// they contain
								// usable data - in example of a p-element
								if (found == false) // remove the div-tag which
													// contains only useless
													// data
									tagStack.pop();
							}
						}
						else
						{
							// as the end of of sub element was reached add it
							// to the parent element
							for (Token t : tagStack.pop())
							{
								if (tagStack.isEmpty())
									tagStack.push(new ArrayList<Token>());
								tagStack.peek().add(t);
							}
						}
					}
				}
			}
			else
			{
				if (tagStack != null && !tagStack.isEmpty()
						&& tagStack.get(0) != null)
					tagStack.peek().add(token);
				else
				{
					List<Token> element = new ArrayList<Token>();
					element.add(token);
					tagStack.push(element);
				}
			}
		}

		// ignore output of div- and unknown-tags
		for (int i = 0; i < tagStack.size(); i++)
			for (Token t : tagStack.get(i))
				if (!t.getHTML().startsWith("<div")
						&& !t.getHTML().startsWith("</div")
						&& !t.getHTML().startsWith("<unknown")
						&& !t.getHTML().startsWith("</unknown"))
					cleaned.add(t);

		return cleaned;
	}
}
