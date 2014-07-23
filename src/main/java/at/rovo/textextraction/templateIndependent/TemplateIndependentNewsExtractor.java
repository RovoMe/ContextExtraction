package at.rovo.textextraction.templateIndependent;

import at.rovo.common.UrlReader;
import at.rovo.parser.LineBreak;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Implementation of the template independent text extraction algorithm presented by Yu-Chieh Wu and Jie-Chi Yang in
 * their paper <em>A Template Independent Method for Large Online News Content Extraction</em>.
 * <p/>
 * The algorithm first parses the HTML content (or the content of the URL) provided in {@link #predictText(String)} into
 * a sequence of consecutive tokens which contain both words and HTML tags. To estimate the content-area for the parsed
 * token-sequence the sequence is passed to {@link #SScore(String)} which calculates the overall segment score.
 * <p/>
 * The overall segment score, furthermore, is calculated by estimating a {@link #WS(String) content score} of the word
 * sequence given in segment <em>s</em> and subtracting a lambda parameter times a {@link #LS(String) link penalty
 * score}. The lambda parameter is used to adjust the penalty size of the link penalty score function and is set to
 * <em>0.03</em> by default.
 * <p/>
 * As segments that contain rich stop-words are highly possible to belong to the content text of the article, the
 * algorithm uses a so called stop-word list to load frequently used common words in articles. These stop-words often do
 * not carry content and add only language nuances but they are used in content text almost exclusively. Furthermore,
 * commercial ads are usually expressed by short descriptive words rather than common stop-words. Therefore, the
 * algorithm utilizes a probability framework based on a stop-word language model which is different from a common
 * language model that needs to be constructed from a full vocabulary of the pages corpus which is furthermore created
 * using n-grams of all the available words within an article. The stop-word language model however measures only the
 * likelihood of all stop-words within the articles token-sequence. This calculation occurs within {@link #WS(String)}
 * on applying the Bayes rule for the stop words.
 * <p/>
 * Hyperlinks are used in HTML pages to link to other pages as well as to start certain scripts on clicking them.
 * Traditionally content are has a rather low frequency of HTML anchors which link to different pages. However, modern
 * online newspapers include them more and more often. To differentiate between content- and non-content HTML anchors Wu
 * and Yang include a penalty score function within their presented algorithm. The link penalty score function consists
 * of the following elements: <ul> <li>{@link #LW(String) The linked word string size} e.g. the number of works between
 * <code>&lt;a href="...">...&lt;/a></code></li> <li>{@link #SWL(String) The number of links that at least contain one
 * stop-word}</li> <li>{@link #UC(String, String) A comparison of the URL string between the given document and the
 * given segment} used to find the average string similarity between all links</li> </ul>
 */
@SuppressWarnings("unused")
public class TemplateIndependentNewsExtractor
{
	/** The logger of this class */
	private final static Logger LOG = LogManager.getLogger(TemplateIndependentNewsExtractor.class);
	/** */
	private String docUrl = null;
	/** A parameter to adjust the link penalty score */
	private float lambda = 0.03f;
	/** A parameter to filter out segments which do not contain sufficient stop words to form a news article */
	private int thetaGap = 4;
	/** The threshold a segment score has to have to be recognized as content */
	private double theta = 1;
	/** The minimum word count a sentence in the article must have in order to be recognized for content extraction */
	private int WC = 9;
	/** The stop-word list */
	private final List<String> SW = new ArrayList<>();

	public static void main(String[] args)
	{
		String url =
				"http://www.washingtonpost.com/business/economy/romney-chose-paul-ryan-to-shift-the-campaign-debate-will-the-gamble-pay-off/2012/08/13/f9ae54e2-e557-11e1-9739-eef99c5fb285_story.html";

//		String url = "http://www.nytimes.com/2014/07/14/world/middleeast/israel-gaza.html?_r=0";

		// 0.9995 ...
//		String url = "http://www.bbc.com/news/business-28282621";
		TemplateIndependentNewsExtractor extractor = new TemplateIndependentNewsExtractor();

		LOG.info("Predicted content of URL: {}: \n{}", url, extractor.predictText(url));
	}

	/**
	 * Initializes a new instance of the template independent content extraction algorithm presented by Wu and Yang.
	 * During initialization also the stop words are loaded into the stop-words list <em>SW</em>.
	 */
	public TemplateIndependentNewsExtractor()
	{
		try
		{
			this.loadStopList();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * Initializes a new instance of the template independent content extraction algorithm presented by Wu and Yang.
	 * During initialization also the stop words are loaded into the stopwords list <em>SW</em>. This constructor also
	 * allows to set specific values for certain heuristic parameters used while predicting the content area.
	 *
	 * @param lambda
	 * 		A value to modify the link penalty score. By default 0.03 is set for <em>lambda</em>
	 * @param theta
	 * 		The threshold a segment score has at least to have to be recognized as content
	 * @param thetaGap
	 * 		A parameter to filter out segments which do not have at least <em>thetaGap</em> stop words
	 * @param WC
	 * 		The word count a single segment has to have to be recognized as content segment
	 */
	public TemplateIndependentNewsExtractor(float lambda, double theta, int thetaGap, int WC)
	{
		this();
		this.lambda = lambda;
		this.theta = theta;
		this.thetaGap = thetaGap;
		this.WC = WC;
	}

	/**
	 * Loads a stop-words.txt file containing the stop-words to use for this application from the resource directory.
	 *
	 * @throws IOException
	 * 		If no stop-words.txt file could be found within the resource directory or if an execption was thrown during
	 * 		processing the stopwords.txt file.
	 */
	private void loadStopList() throws IOException
	{
		// stop-words taken from http://www.ranks.nl/resources/stopwords.html
		// and http://norm.al/2009/04/14/list-of-english-stop-words/
		URL stopWordFileURL = getClass().getResource("/stopwords.txt");
		if (null == stopWordFileURL)
		{
			throw new IOException("Could not locate stopwords.txt file");
		}

		try
		{
			File stopWordFile = new File(stopWordFileURL.toURI());
			try (BufferedReader br = new BufferedReader(new FileReader(stopWordFile)))
			{
				String line = br.readLine();
				while (line != null)
				{
					this.SW.add(line.trim());
					line = br.readLine();
				}
			}
		}
		catch (URISyntaxException ex)
		{
			LOG.error("Could not load stopword list", ex);
		}
	}

	/**
	 * Predicts the main article for the provided <em>url</em>.
	 *
	 * @param url
	 * 		Either the URL of the page to predict the article for or a string containing the HTML code of the page to
	 * 		predict the article for
	 *
	 * @return The predicted main article for the provided <em>url</em>
	 */
	public String predictText(String url)
	{
		// Load the content of the URL or use the content already available in
		// the URL and parse the content into tokens
		String html;
		if (url.startsWith("http://") || url.startsWith("https://"))
		{
			this.docUrl = url;

			UrlReader reader = new UrlReader(true);
			html = reader.readPage(url);
		}
		else
		{
			html = url;
		}
		// LOG.debug("Parsing {}", html);

		Parser parser = new Parser();
		parser.setIncludeLineBreaks(true);

		ParseResult result = parser.tokenize(html, false);
		List<Token> tokens = result.getParsedTokens();
		if (LOG.isTraceEnabled())
		{
			LOG.trace("Parsed tokens: {}", tokens);
			LOG.trace("");
		}

		// get the start time the actual extraction (without downloading and
		// parsing the page) took place
		long startTime = System.currentTimeMillis();

		// At the beginning, we define a segment s consists of a sequence of
		// consecutive tokens (might list in multiple lines).
		List<String> candidates = this.generateSequenceListBasedOnLineGaps(tokens);
		if (LOG.isDebugEnabled())
		{
			LOG.debug("Candidate set: {}", candidates);
			LOG.debug("");
		}

		// Initially, the algorithm scans the whole document and roughly
		// localizes a candidate set by estimating the maximum score for each
		// sequence. The scoring function is to estimate the possibility of s to
		// be the content area
		double maxScore = 0.;
		SortedSet<Sequence> sortedSet = new TreeSet<>(new ScoreComparator());
		int pos = 0;
		for (String s : candidates)
		{
			// The algorithm selects only the top5 segments based on the
			// proposed stop-word language model. This iteration sorts the
			// sequences according to their stop-words language model
			double score = this.WS(s);
			Sequence seq = new Sequence(s, score, pos++);
			sortedSet.add(seq);
		}
		if (LOG.isDebugEnabled())
		{
			LOG.debug("Candidate set after applying stop-word language model: {}", sortedSet);
			LOG.debug("");
		}

		// now filter only the top5 candidates according to their previously
		// calculated stop-word language model and update the score with the
		// link penalty score
		SortedSet<Sequence> top5 = new TreeSet<>(new PositionComparator());
		for (int i=0; i<5; i++)
		{
			Sequence seq = sortedSet.first();
			sortedSet.remove(seq);
			seq.updateScore(this.lambda, this.LS(seq.getSequence()));
			top5.add(seq);
		}
		if (LOG.isDebugEnabled())
		{
			LOG.debug("Top 5 candidate set: {}", top5);
			LOG.debug("");
		}

		// In the final step, the algorithm finds the news content area by
		// combining both scores from stop-word language model and link penalty.
		StringBuilder sb = new StringBuilder();
		for (Sequence sequence : top5)
		{
			String s = sequence.getSequence();
			s = s.replaceAll("(?s)<a[^>]*?>(.*?)</a>", "$1");
			sb.append(this.removeUnclosedAnchorTags(s));
			sb.append("\n");
			LOG.debug("S: {} = {}", sequence.getScore(), s);
		}

		long endTime = System.currentTimeMillis();
		long timeNeeded = endTime - startTime;
		LOG.info("Content extraction took {} seconds ({} milliseconds)", TimeUnit.MILLISECONDS.toSeconds(timeNeeded), TimeUnit.MILLISECONDS.toMillis(timeNeeded));

		return sb.toString();
	}

	private List<String> generateSequenceListBasedOnLineGaps(List<Token> tokens)
	{
		List<String> sequences = new ArrayList<>();
		StringBuilder lineCandiate = new StringBuilder();
		StringBuilder sequenceCandidate = new StringBuilder();
		StringBuilder candiadate = new StringBuilder();
		int wordsInLine = 0;
		int gap = 0;
		for (Token token : tokens)
		{
			if (token instanceof Word)
			{
				wordsInLine++;
				lineCandiate.append(token.getText());
				// don't add a blank if the token starts with one of the below
				// listed characters
				if (!token.getText().startsWith(".") && !token.getText().startsWith(",") &&
					!token.getText().startsWith(";"))
				{
					lineCandiate.append(" ");
				}
			}
			else if (token instanceof LineBreak)
			{
				boolean resetGap = false;
				// It starts from the line that contains the number of words
				// which is more than the predefined threshold WC
				if (wordsInLine > this.WC)
				{
					resetGap = true;
					sequenceCandidate.append(lineCandiate);
				}
				// A gap means a line that has less number of words compared
				// with WC
				else if (gap >= 0)
				{
					gap++;
					lineCandiate.delete(0, lineCandiate.length());
				}

				// Second, it scans the following parts of the document until
				// the number of gap reaches gap>thetaGap
				if (gap > this.thetaGap && sequenceCandidate.length() > 0)
				{
					sequences.add(sequenceCandidate.toString());
					sequenceCandidate.delete(0, sequenceCandidate.length());
					gap = 0;
				}
				if (resetGap)
				{
					gap = 0;
				}
				wordsInLine = 0;
			}
			else
			{
				Tag tag = (Tag) token;
				// for HTML anchors remove everything except the tag name and
				// the hyperlink-reference "href=..." segment which we need
				// later to count link specific statistics
				if (tag.getShortTag().equals("a"))
				{
					String urlRef = null;
					if (tag.isOpeningTag() && tag.getHTML().contains("href="))
					{
						String _tag = tag.getHTML();
						for (String seg : _tag.split(" "))
						{
							if (seg.contains("href"))
							{
								urlRef = seg.replaceAll(">", "");
								break;
							}
						}

						sequenceCandidate.append("<a ");
						sequenceCandidate.append(urlRef);
						sequenceCandidate.append(">");

					}
					else if (!tag.isOpeningTag() && sequenceCandidate.length() > 0)
					{
						if (sequenceCandidate.toString().endsWith(" "))
						{
							sequenceCandidate.delete(sequenceCandidate.length() - 1, sequenceCandidate.length());
						}
						sequenceCandidate.append("</a>");
						sequenceCandidate.append(" ");
					}
				}
			}
		}
		return sequences;
	}

	/**
	 * Removes any unclosed anchor tags from the given segment.
	 *
	 * @param segment
	 * 		The segment to remove any unclosed anchor HTML tags
	 *
	 * @return The segment without any unclosed HTML tags
	 */
	private String removeUnclosedAnchorTags(String segment)
	{
		StringBuilder sb = new StringBuilder();
		int anchorStartIndex;
		int anchorEndIndex;
		int pos = 0;
		if (!segment.contains("<a ") && !segment.contains("</a>"))
		{
			// no more anchor tags found
			return segment;
		}
		do
		{
			anchorStartIndex = segment.indexOf("<a ", pos);
			anchorEndIndex = segment.indexOf("</a>", anchorStartIndex);

			// the index starts at the beginning of the string,
			// we however want to continue after the end-anchor
			if (anchorEndIndex > -1)
			{
				pos = anchorEndIndex + 4;
			}
			if (anchorStartIndex > anchorEndIndex)
			{
				if (LOG.isDebugEnabled())
				{
					LOG.debug("Found unclosed anchor in sequence: {}", segment);
				}
				// we need to remove the unclosed link
				int endIndex = segment.indexOf(">", pos);
				pos = endIndex;
				sb.append(segment.substring(0, anchorStartIndex));
				if (endIndex > -1 && endIndex + 1 < segment.length())
				{
					sb.append(segment.substring(endIndex + 1));
				}
				if (!sb.toString().trim().equals("") && LOG.isDebugEnabled())
				{
					LOG.debug("Segment after removal of the unclosed anchor: {}", segment);
				}
			}
		}
		while (anchorStartIndex > -1);

		return sb.toString();
	}

	/**
	 * Calculates the overall segment score of a given candidate <em>s</em> by calculating the {@link #WS(String)
	 * content score of word sequences} given in the segment s and subtracting <em>lambda</em> times the calculated
	 * {@link #LS(String) link penalty score}
	 *
	 * @param segment
	 * 		A sequence of consecutive tokens which includes both tokens and words
	 *
	 * @return The calculated overall segment score for the given candidate
	 */
	private double SScore(String segment)
	{
		// SScore(s) = WS(s) - lambda * LS(s)
		// WS(s) estimates the content score of the word sequence given the
		// segment s by applying Bayes rule for the stop-words found within
		// the segment
		double ws = this.WS(segment);
		// LS(s) is the function of link penalty score for s
		double ls = this.LS(segment);
		double result = ws - this.lambda * ls;
		if (LOG.isTraceEnabled())
		{
			LOG.trace("Overall segment score: {} (content-score WS: {}; link penalty score LS: {}) for segment {}",
					  result, ws, ls, segment);
		}
		return result;
	}

	/**
	 * Estimates the content score of the word sequence given the segment <em>s</em>.
	 * <p/>
	 * A segment that contains rich stop-words is highly possible to be the content text. A probability framework based
	 * on stop-word language model is used to detect such candidates.
	 *
	 * @param segment
	 * 		The segment containing the words to estimate the score for
	 *
	 * @return The content score of the segment
	 */
	private double WS(String segment)
	{
		// The stop-word language model measures the likelihood of all stop-words
		// in the given segment s. The likelihood is applied by Bayes' rule
		// P(s|SW) = P(s,SW)/P(SW) = P(SW|s)P(s)/P(SW) with P(s) being the
		// language model of candidate s and P(SW) the stop-word language model of
		// the stop-word sequence - but both can be ignored as both do not affect
		// the finding of text area!
		// P(SW|s) is the most important factor for the above equation. It
		// measures the probability of generating SW (stopword) given the
		// candidate s.
		segment = segment.replace("&rsquo;", "'");
		segment = segment.replaceAll("<(\\w*)[^>]*>([^<]*?)</\\1>", "$2");
		segment = segment.replaceAll("[,|.|:|;|!|?]", "");
		segment = segment.toLowerCase();

		Map<String, Integer> table = new Hashtable<>();
		double devisor = 0.;
		// calculate the devisor by generating the word frequency for every
		// stop-word found within the given segment
		for (String w : this.SW)
		{
			devisor += this.getWordFrequency(w, segment, table);
		}

		if (devisor == 0.)
		{
			return 0.;
		}

		double p = 1.;
		for (String stopWord : this.SW)
		{
			for (String seq : segment.split(" "))
			{
				if (seq.trim().equals(stopWord))
				{
					int wordFrequency = table.get(stopWord);
					p *= wordFrequency / devisor;
				}
			}
		}

		return p;
	}

	/**
	 * Calculates the frequency of the given stop-word <em>stopWord</em> of being in the sequence <em>segment</em>. This
	 * function also fills the given table with the word frequency of the provided <em>stopWord</em>.
	 *
	 * @param stopWord
	 * 		The stop-word to calculate the word frequency for
	 * @param segment
	 * 		The sequence containing all words
	 * @param table
	 * 		The table that should be filled with the word frequencies of the stop words found within the given segment
	 *
	 * @return The frequency of the word inside the sequence
	 */
	private int getWordFrequency(String stopWord, String segment, Map<String, Integer> table)
	{
		if (segment.trim().equals(stopWord))
		{
			if (table != null)
			{
				table.put(stopWord, 1);
			}
			return 1;
		}

		// count all tokens contained within the given segment
		// subtract the number of tokens after removing all occurrences of the
		// given stop-word to obtain the total number of stopWords contained
		// within the segment
		int totalNum = segment.split(" ").length;
		int numAfterRemoval = segment.replaceAll("\\b" + stopWord + "(?<!.>|<.|</.)\\b[^<]?", "").split(" ").length;
		int wordFreq = totalNum - numAfterRemoval;

		if (table != null)
		{
			table.put(stopWord, wordFreq);
		}

		return wordFreq;
	}

	/**
	 * Estimates a link penalization score for the given segment <em>s</em>.
	 *
	 * @param s
	 * 		The segment <em>s</em> containing words and links
	 *
	 * @return The link penalization score for the given segment
	 */
	private double LS(String s)
	{
		// LS(s) = LW(s)+SWL(s)+UC(s.url, Doc.url)
		// LW(s) is the linked word string size (the number of words between
		//       <a href="...">...</a>)
		// SWL(s) measures the number of links that contain at least one stopword
		// UC(s.url, Doc.url) compares the url string between the given html
		//                    document (Doc) and s
		double res = this.LW(s) + this.SWL(s) + this.UC(s, this.docUrl);
		if (LOG.isTraceEnabled())
		{
			LOG.trace("s: {} = {}", s, res);
		}
		return res;
	}

	/**
	 * Counts the words inside link-tag-pairs (&lt;a href="..">...&lt;/a>).
	 *
	 * @param s
	 * 		The segment containing text and links
	 *
	 * @return The number of words inside a link-tag-pair
	 */
	private int LW(String s)
	{
		// remove all attributes specified in the link to not end up with a wrong
		// number of words
		String sModified = s.replaceAll("(?s)<a[^>]*?>(.*?)</a>", "<a>$1</a>");
		sModified = sModified.replaceAll("\\W*<([^>]*?)>\\W*", " <$1> ");
		int numTokens = sModified.split(" ").length;
		int res = numTokens - sModified.replaceAll("(?s)<a>.*?</a>", "<a> </a>").split(" ").length;
		if (LOG.isTraceEnabled())
		{
			LOG.trace("s: {} = {}", s, res);
		}
		return res;
	}

	/**
	 * Measures the number of links that contain at least one stopword.
	 *
	 * @param s
	 * 		The segment containing text and links
	 *
	 * @return The proportion of links that contain at least one stopword
	 */
	private double SWL(String s)
	{
		Pattern p = Pattern.compile("(?s)<a[^>]*?>(.*?)</a>");
		Matcher m = p.matcher(s);
		int totalLinks = 0;
		int linksWithStopword = 0;
		while (m.find())
		{
			totalLinks++;
			String urlText = m.group(1);
			for (String stopword : this.SW)
			{
				for (String text : urlText.split(" "))
				{
					if (text.equals(stopword))
					{
						linksWithStopword++;
						break;
					}
				}
			}
		}
		if (totalLinks == 0)
		{
			return 0.;
		}
		//		double res = ((double)linksWithStopword) / totalLinks;
		return linksWithStopword;
	}

	/**
	 * Compares the URL string between the given HTML document (docUrl) and the URL found in the segment s (sURL).
	 * <p/>
	 * It therefore needs to find the average string similarity among all its sub-links.
	 *
	 * @param sUrl
	 * 		The URL found in the segment s
	 * @param docUrl
	 * 		The URL of the given HTML document
	 *
	 * @return The average string similarity among all sub-links
	 */
	private double UC(String sUrl, String docUrl)
	{
		// UC(s.url, Doc.url) = avg PSim(li.url, Doc.url)
		// where li is an element of s
		// To reduce the effect of extreme-values, we average UC by estimating
		// averaged URL string similarity score between given HTML document and
		// all its sublink li in candidate s.
		Pattern pattern = Pattern.compile("<a href=\"(.*?)\">");
		Matcher matcher = pattern.matcher(sUrl);
		List<String> urls = new ArrayList<>();
		while (matcher.find())
		{
			urls.add(matcher.group(1));
		}
		if (urls.isEmpty())
		{
			return 0.;
		}

		double val = 0.;
		for (String url : urls)
		{
			val += PSim(url, docUrl);
		}
		double res = val / urls.size();
		if (LOG.isTraceEnabled())
		{
			LOG.trace("sUrl: {}, docUrl: {} = {}", sUrl, docUrl, res);
		}
		return res;
	}

	/**
	 * Calculates the string similarity based on prefix weighting. The calculation is done by comparing the strings on a
	 * character-based comparison and including the actual position of the character within the respective string. Two
	 * strings are equal if this function returns a value of <em>0.0</em>.
	 * <p/>
	 * On comparing f.e two strings <em>test</em> and <em>tesT</em>, this function will return a similarity value of
	 * <em>4.0</em> while on comparing the first string with <em>Test</em> this method will return <em>16.0</em>. This
	 * short but simple example should help to illustrate that the earlier a difference is found within both strings,
	 * the higher the output of this function will be.
	 *
	 * @param xUrl
	 * 		The first URL to calculate a similarity value for
	 * @param yUrl
	 * 		The second URL used to calculate the similarity value
	 *
	 * @return The similarity value between both provided <em>url</em>s. If both provided strings are identical, a
	 * similarity value of 0.0 will be returned. If the
	 */
	private static double PSim(String xUrl, String yUrl)
	{
		double part1 = 0;
		double part2 = 0;
		for (int i = 0, j = 0; i < xUrl.length() && j < yUrl.length(); i++, j++)
		{
			int diff = Math.abs(xUrl.charAt(i) - yUrl.charAt(j));
			part1 += (diff / (i + 1.));
			part2 += (diff / (j + 1.));
		}
		return part1 / xUrl.length() + part2 / yUrl.length();
	}
}
