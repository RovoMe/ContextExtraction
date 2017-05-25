package at.rovo.textextraction.mss;

import at.rovo.common.UrlReader;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.textextraction.TextUtils;
import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class represents the simplified maximum subsequence segmentation approach presented by Jeff Pasternack and Dan
 * Roth in their paper on 'Extracting Article Text from the Web with Maximum Subsequence Segmentation'
 * <p>
 * The simple method predicts article text through assigning a static score of -3.25 to every tag and +1 to every word
 * upon building a score-list which will be used by the maximum subsequence segmentation algorithm to find the
 * subsequence with the highest value.
 * <p>
 * <b>Note:</b> The simple maximum subsequence segmentation does not rely on any learning or training mechanism!
 *
 * @author Roman Vottner
 */
public class SimpleMSS extends MaximumSubsequenceSegmentation
{
    /** The LOG of this instance **/
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    /** The parser used to download the content from pages on the Internet **/
    private Parser parser = null;

    /**
     * Creates a new instance of a simple maximum subsequence segmentation method
     */
    public SimpleMSS()
    {
        super();

        this.parser = new Parser();
    }

    /**
     * Predicts article text based on assigning a score of -3.25 to every tag and +1 to every word and building a
     * score-list using those scores for every token in the provided parameter.
     * <p>
     * This score-list is now used to run the maximum subsequence segmentation algorithm and to find the subsequence
     * with the highest value.
     * <p>
     * This start position of the sequence and the length of the returned array are now used to find the article text in
     * the provided list of tokens
     *
     * @param url
     *         The URL of the page to predict its content from
     *
     * @return The predicted article of the provided URL; null if the HTML page could not be read
     *
     * @throws NoSubsequenceFoundException
     *         If no subsequence could be calculated
     */
    @Override
    public String predictText(final String url) throws NoSubsequenceFoundException
    {
        UrlReader reader = new UrlReader();
        String html = reader.readPage(url);
        if (html == null || html.equals(""))
        {
            LOG.error("No html content available!");
            return null;
        }

        ParseResult parse = this.parser.tokenize(html, false);
        List<Token> htmlToken = parse.getParsedTokens();

        // Build a score-list for the Maximum Subsequence algorithm to work with. Like in the paper, Jeff Pasternack and
        // Dan Roth suggested, the simple method assigns a score of -3.25 to every tag and +1 to every word
        List<Double> score = new ArrayList<>();
        for (Token token : htmlToken)
        {
            if (token instanceof Tag)
            {
                score.add(-3.25);
            }
            else if (token instanceof Word)
            {
                score.add(1d);
            }
        }

        // run the Maximum Subsequence Optimization
        List<Double> maxSS = new ArrayList<>();
        int start = this.topMaximumSubsequence(score, maxSS);

        LOG.debug("maxSS: {}", maxSS);
        LOG.debug("start: {}", start);
        LOG.debug("html.size: {}", htmlToken.size());

        if (maxSS.size() < 1)
        {
            throw new NoSubsequenceFoundException("No maximum sequence found!");
        }

        // build the list of the predicted article list
        List<Token> text = new ArrayList<>();
        for (int i = start; i <= start + maxSS.size(); i++)
        {
            text.add(htmlToken.get(i));
        }

        LOG.debug("predictedText: {}", text);

        return TextUtils.formatText(this.cleanText(text));
    }

    /**
     * Predicts article text based on assigning a score of -3.25 to every tag and +1 to every word and building a
     * score-list using those scores for every token in the provided parameter.
     * <p>
     * This score-list is now used to run the maximum subsequence segmentation algorithm and to find the subsequence
     * with the highest value.
     * <p>
     * This start position of the sequence and the length of the returned array are now used to find the article text in
     * the provided list of tokens
     *
     * @param urls
     *         The URLs of the pages to predict content from
     *
     * @return The predicted articles of the provided URLs; null if the HTML page could not be read
     *
     * @throws NoSubsequenceFoundException
     *         If no subsequence could be calculated
     */
    @Override
    public List<String> predictText(final List<String> urls) throws NoSubsequenceFoundException
    {
        List<String> predictedContent = new ArrayList<>();
        for (String url : urls)
        {
            predictedContent.add(this.predictText(url));
        }
        return predictedContent;
    }
}
