package at.rovo.textextraction.mss;

import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import at.rovo.common.UrlReader;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;

/**
 * <p>
 * This class represents the simplified maximum subsequence segmentation
 * approach presented by Jeff Pasternack and Dan Roth in their paper on
 * 'Extracting Article Text from the Web with Maximum Subsequence Segmentation'
 * </p>
 * <p>
 * The simple method predicts article text through assigning a static score of
 * -3.25 to every tag and +1 to every word upon building a score-list which will
 * be used by the maximum subsequence segmentation algorithm to find the
 * subsequence with the highest value.
 * </p>
 * <p>
 * <b>Note:</b> The simple maximum subsequence segmentation does not rely on any
 * learning or training mechanism!
 * </p>
 * 
 * @author Roman Vottner
 */
public class SimpleMSS extends MaximumSubsequenceSegmentation
{
	/** The logger of this instance **/
	private static Logger logger = LogManager.getLogger(SimpleMSS.class);
	/** The parser used to download the content from pages on the Internet **/
	private Parser parser = null;

	/**
	 * <p>
	 * Creates a new instance of a simple maximum subsequence segmentation
	 * method
	 * </p>
	 */
	public SimpleMSS()
	{
		super();

		this.parser = new Parser();
	}

	/**
	 * <p>
	 * Predicts article text based on assigning a score of -3.25 to every tag
	 * and +1 to every word and building a score-list using those scores for
	 * every token in the provided parameter.
	 * </p>
	 * <p>
	 * This score-list is now used to run the maximum subsequence segmentation
	 * algorithm and to find the subsequence with the highest value.
	 * </p>
	 * <p>
	 * This start position of the sequence and the length of the returned array
	 * are now used to find the article text in the provided list of tokens
	 * </p>
	 * 
	 * @param url
	 *            The URL of the page to predict its content from
	 * @return The predicted article of the provided URL; null if the HTML page
	 *         could not be read
	 * @throws NoSubsequenceFoundException
	 *             If no subsequence could be calculated
	 */
	@Override
	public String predictText(final String url)
			throws NoSubsequenceFoundException
	{
		UrlReader reader = new UrlReader();
		String html = reader.readPage(url);
		if (html == null || html.equals(""))
		{
			logger.error("No html content available!");
			return null;
		}

		ParseResult parse = this.parser.tokenize(html, false);
		List<Token> htmlToken = parse.getParsedTokens();

		// Build a score-list for the Maximum Subsequence algorithm to work with
		// Like in the paper, Jeff Pasternack and Dan Roth suggested, the simple
		// method assigns a score of -3.25 to every tag and +1 to every word
		List<Double> score = new ArrayList<Double>();
		for (Token token : htmlToken)
			if (token instanceof Tag)
				score.add(-3.25);
			else if (token instanceof Word)
				score.add(1d);

		// run the Maximum Subsequence Optimization
		List<Double> maxSS = new ArrayList<Double>();
		int start = this.topMaximumSubsequence(score, maxSS);

		logger.debug("maxSS: {}", maxSS);
		logger.debug("start: {}", start);
		logger.debug("html.size: {}", htmlToken.size());

		if (maxSS == null || maxSS.size() < 1)
			throw new NoSubsequenceFoundException("No maximum sequence found!");

		// build the list of the predicted article list
		List<Token> text = new ArrayList<Token>();
		for (int i = start; i <= start + maxSS.size(); i++)
			text.add(htmlToken.get(i));

		logger.debug("predictedText: {}", text);

		return this.formatText(this.cleanText(text));
	}

	/**
	 * <p>
	 * Predicts article text based on assigning a score of -3.25 to every tag
	 * and +1 to every word and building a score-list using those scores for
	 * every token in the provided parameter.
	 * </p>
	 * <p>
	 * This score-list is now used to run the maximum subsequence segmentation
	 * algorithm and to find the subsequence with the highest value.
	 * </p>
	 * <p>
	 * This start position of the sequence and the length of the returned array
	 * are now used to find the article text in the provided list of tokens
	 * </p>
	 * 
	 * @param urls
	 *            The URLs of the pages to predict content from
	 * @return The predicted articles of the provided URLs; null if the HTML
	 *         page could not be read
	 * @throws NoSubsequenceFoundException
	 *             If no subsequence could be calculated
	 */
	@Override
	public List<String> predictText(final List<String> urls)
			throws NoSubsequenceFoundException
	{
		List<String> predictedContent = new ArrayList<String>();
		for (String url : urls)
			predictedContent.add(this.predictText(url));
		return predictedContent;
	}
}
