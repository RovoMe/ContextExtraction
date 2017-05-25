package at.rovo.textextraction;

import at.rovo.common.UrlReader;
import at.rovo.diff.LinearDiff;
import at.rovo.diff.Results;
import at.rovo.diff.Snake;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.textextraction.mss.NoSubsequenceFoundException;
import at.rovo.textextraction.mss.SimpleMSS;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * As pages from the same domain often will use the same content layout (including link structure and image-areas), this
 * algorithm assumes that by reading two pages from the same domain, which have the same content layout in common, will
 * reveal its template and therefore allow for easier and faster extraction of the actual content area.
 * <p/>
 * This extraction method will read two pages from the same domain where the relative path of both pages should produce
 * a tiny distance in regards to the plain URL. After reading both pages this algorithm normalizes words and HTML tags
 * in order to find the content template. After producing the normalization step on a copy of the actual data, both
 * normalization copies are sent to a diff algorithm to extract the actual changes between both pages. As both pages
 * share the same page layout, the areas with the most significant changes may be considered as content area. The
 * extraction of the most significant changes is influenced by a scoring function (like a customized simple maximum
 * subsequence segmentation) to boost certain words and/or tags and ignore areas which have less words.
 * <p/>
 * WIP: The extraction may actually need two passes - one with words being replaced with the same character in both
 * input pages while a second pass may change the words of the second input file to something other in order to pin down
 * the actual areas of content. The primer pass will reveal only the changes (added words and/or HTML tags in comparison
 * to the second page) but not reveal the actual start of the content segment.
 */
public class TemplateBasedExtraction
{
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public static void main(String[] args) throws IOException
    {
        String[] inFile = new String[] {
                "http://www.washingtonpost.com/business/economy/romney-chose-paul-ryan-to-shift-the-campaign-debate-will-the-gamble-pay-off/2012/08/13/f9ae54e2-e557-11e1-9739-eef99c5fb285_story.html",
                "http://www.washingtonpost.com/business/economy/obamas-record-on-outsourcing-draws-criticism-from-the-left/2012/07/09/gJQAljJCZW_story.html",
                //"http://www.washingtonpost.com/business/technology/larry-page-speaks-at-googles-annual-conference-in-san-francisco/2013/05/15/ac591e22-bda4-11e2-9b09-1638acc3942e_story.html",
                //"http://www.washingtonpost.com/business/technology/google-to-make-deep-cuts-at-motorola/2012/08/13/501f20b2-e53b-11e1-8f62-58260e3940a0_story.html?hpid=z3",
                //"http://www.washingtonpost.com/business/technology/google-fights-piracy-with-search/2012/08/10/f8d1be0e-e31f-11e1-a25e-15067bb31849_story.html",
                //"http://www.independent.co.uk/news/uk/politics/socialhousing-landlords-training-staff-to-spot-tenants-at-risk-of-suicide-8621669.html",
                //"http://www.independent.co.uk/news/uk/politics/revealed-devastating-impact-of-bedroom-tax-sees-huge-leap-in-demand-for-emergency-hardship-handouts-for-tenants-8621666.html",
                //"http://www.independent.co.uk/news/world/europe/revealed-eerie-new-images-show-forgotten-french-apartment-that-was-abandoned-at-the-outbreak-of-world-war-ii-and-left-untouched-for-70-years-8613867.html"
                //"http://www.nytimes.com/2015/06/02/business/media/jenner-reveals-new-name-in-vanity-fair-article.html?_r=0",
                //"http://www.nytimes.com/2015/06/02/us/drought-is-bearing-fruit-for-washington-wineries.html"
                //"http://www.bbc.com/news/world-asia-32969054",
                //"http://www.bbc.com/news/world-africa-32970260"
                //"http://www.leicestermercury.co.uk/man-taken-hospital-car-crash-M1-southbound/story-26610835-detail/story.html",
                //"http://www.leicestermercury.co.uk/Motorcyclist-killed-Wycombe-Road-Leicester-crash/story-26611305-detail/story.html"
//                "http://www.thestar.co.uk/news/business/business-news/relief-for-south-yorkshire-commuters-as-national-rail-strike-is-called-off-1-7287900", // issue
//                "http://www.thestar.co.uk/news/local/officer-thought-boy-had-died-in-his-arms-at-hillsborough-1-7288417" // issue
//                "http://www.scotsman.com/news/politics/top-stories/nicola-sturgeon-vow-more-powers-for-scots-islands-1-3789054", // issue
//                "http://www.scotsman.com/news/politics/top-stories/hard-up-councils-own-pubs-hotels-farms-and-castle-1-3789764" // issue

        };

        // will hold the normalized words and tags where words differ between both input pages
        List<List<Token>> p = new ArrayList<>();
        // will also hold normalized words and tags but with unified words for both input pages
        List<List<Token>> q = new ArrayList<>();
        List<List<Token>> htmlTokens = new ArrayList<>();
        List<Token> selTokens;
        boolean first = false;
        // the replacement characters for words in the first and second page
        String[] word = new String[] {"w", "t"};

        // Parse both input pages and normalize words and HTML tags in order to produce comparable results
        for (int i = 0; i < inFile.length; i++)
        {
            String html = readFile(inFile[i]);
            Parser parser = new Parser();
            ParseResult parse = parser.tokenize(html, false);
            List<Token> tokens = parse.getParsedTokens();
            htmlTokens.add(tokens);

            p.add(normalize(tokens, word[i]));
            q.add(normalize(tokens, word[0]));
        }

        if (first)
        {
            selTokens = htmlTokens.get(0);
        }
        else
        {
            selTokens = htmlTokens.get(1);
        }

        final Token[] t = new Token[0];
        final SimpleMSS mss = new SimpleMSS();
        for (int i = 1; i < inFile.length; i++)
        {
            try
            {
                List<Integer> dist = new ArrayList<>();
                dist.add(0);
                Results<Token> res = LinearDiff.Compare(p.get(0).toArray(t), p.get(i).toArray(t));
                // Results<Token> res = GreedyDiff.Compare(p.get(0).toArray(t), p.get(i).toArray(t), false);
                if (res != null)
                {
                    buildScoreModifier(res, dist, first);
                }
                //dist.remove(dist.size() - 1);

                try
                {
                    StringBuilder sb = new StringBuilder();
                    // for (Token tok : selTokens)
                    // {
                    //   sb.append(tok.getText()+"\n");
                    // }
                    // writeFile("html.txt", sb.toString());
                    // sb = new StringBuilder();
                    for (Token tok : p.get(0))
                    {
                        sb.append(tok.getText()).append("\n");
                    }
                    writeFile("p0.txt", sb.toString());
                    sb = new StringBuilder();
                    for (Token tok : p.get(1))
                    {
                        sb.append(tok.getText()).append("\n");
                    }
                    writeFile("p1.txt", sb.toString());

                    int d = 0;
                    // Build a score-list for the Maximum Subsequence algorithm to work with
                    // Like in the paper, Jeff Pasternack and Dan Roth suggested, the simple
                    // method assigns a score of -3.25 to every tag and +1 to every word
                    List<Double> score = new ArrayList<>();
                    LOG.debug("selTokens size: {}", selTokens.size());
                    LOG.debug("dist size: {}", dist.size());
                    if (LOG.isTraceEnabled()) {
                        int numTags = 0;
                        for (Token token : selTokens) {
                            if (token instanceof Tag) {
                                numTags++;
                            }
                        }
                        LOG.trace("numTags: {}", numTags);
                    }

                    for (Token token : selTokens)
                    {
                        if (token instanceof Tag)
                        {
                            // 2.4
                            // Tag tag = (Tag)token;
                            // String st = tag.getShortTag();
                            // if (st.equals("p"))
                            //   score.add(0.25*dist.get(d++));
                            // else if (st.equals("a"))
                            //   score.add(-2.);
                            // else if (st.equals("script"))
                            //   score.add(-9.);
                            // else
                            score.add(-3.25 + 0.25 * dist.get(d++));
                            LOG.trace("score {} for token {} (distance: {})", score.get(score.size()-1), token, d);
                        }
                        else if (token instanceof Word) // 1.5
                        {
                            score.add(1d);
//                            score.add(1d + 1.0 * dist.get(d++));
                        }
                        // score.add(1.);
                    }

                    // run the Maximum Subsequence Optimization
                    List<Double> maxSS = new ArrayList<>();
                    int start = mss.topMaximumSubsequence(score, maxSS);
                    // System.out.println("maxSS: "+maxSS);
                    // System.out.println("start: "+start);
                    // System.out.println("html.size: "+selTokens);

                    if (maxSS.size() < 1)
                    {
                        throw new NoSubsequenceFoundException("No maximum sequence found!");
                    }

                    // build the list of the predicted article list
                    List<Token> text = new ArrayList<>();
                    for (int j = start; j <= start + maxSS.size(); j++)
                    {
                        text.add(selTokens.get(j));
                    }
                    System.out.println("predictedText: " + text);
                    System.out.println();

                    String output = TextUtils.formatText(mss.cleanText(text));
                    output = output.replaceAll("[\r|\t\n]+", "\n");
                    System.out.println(output);
                }
                catch (NoSubsequenceFoundException e)
                {
                    e.printStackTrace();
                }
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
        }
    }

    private static String readFile(String file) throws IOException
    {
        System.out.println("Reading file '" + file + "'");
        if (file.startsWith("http://"))
        {
            return new UrlReader().readPage(file);
        }
        String result;
        try(BufferedReader br = new BufferedReader(new FileReader(file)))
        {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();

            while (line != null)
            {
                sb.append(line);
                line = br.readLine();
            }
            result = sb.toString();
        }

        return result;
    }

    private static void writeFile(String file, String content) throws IOException
    {
        System.out.print("Writing file '" + file + "'");
        PrintWriter out = new PrintWriter(new FileWriter(file));

        // Write text to file
        out.println(content);
        out.close();
        System.out.println(" ... DONE");
    }

    /**
     * WIP
     * This method should help in modifying the calculated score in order to boost certain words and/or HTML tags
     * compared to the simple maximum subsequent algorithm.
     *
     * @param res   The list of parsed tokens
     * @param dist  A list containing the calculated scores or distances from the initial simple maximum subsequent
     *              algorithm
     * @param first If set to <em>true</em> this will build the score on the first sample tokens while setting this
     *              parameter to <em>false</em> will calculate the score on the second sample
     */
    private static void buildScoreModifier(Results<Token> res, List<Integer> dist, boolean first)
    {
        // run through all the snakes returned by the applied diff algorithm between both inputs and calculate the score
        // based on the type of snake returned for the found change
        List<Snake<Token>> snakes = res.getSnakes();
        if (snakes != null)
        {
            int delVal = 0;
            for (Snake<Token> snake : snakes)
            {
                // diagonal values > 0 mark a sequence of equal characters in both input pages
                if (snake.DiagonalLength > 0)
                {
                    for (int j = 0; j < snake.DiagonalLength; j++)
                    {
                        dist.add(0);
                    }
                    delVal = 0;
                }

                if (first)
                {
                    // characters deleted from the first input page
                    if (snake.ADeleted > 0)
                    {
                        // int tmp = dist.get(dist.size() - 1);
                        int tmp = delVal + snake.ADeleted;
                        dist.add(tmp);
                    }
                    // characters not appearing in the first input page (aka added characters in the second page)
                    else if (snake.BInserted > 0)
                    {
                        delVal += snake.BInserted;
                    }
                }
                else
                {
                    if (snake.BInserted > 0)
                    {
                        // int tmp = dist.get(dist.size() - 1);
                        int tmp = delVal + snake.BInserted;
                        dist.add(tmp);
                    }
                    else if (snake.ADeleted > 0)
                    {
                        delVal += snake.ADeleted;
                    }
                }
            }
        }
    }

    /**
     * Replaces HTML tokens found within a parsed page with their empty tag name. This should help to determine the
     * border of actual content and fill data like link sections or inlined graphics.
     *
     * @param tokens The list of parsed tokens including words
     * @param word The character or word that should be used to normalize words
     * @return The list of normalized tokens
     */
    private static List<Token> normalize(List<Token> tokens, String word)
    {
        List<Token> normalized = new ArrayList<>();
        for (Token token : tokens)
        {
            if (token instanceof Word)
            {
                normalized.add(new Word(word));
            }
            else if (token instanceof Tag)
            {
                Tag tag = (Tag) token;
                normalized.add(new Tag(
                        "<" + (!tag.isOpeningTag() && !tag.isInlineClosingTag() ? "/" : "") + tag.getShortTag() +
                        (tag.isInlineClosingTag() ? " /" : "") + ">"));
            }
        }
        return normalized;
    }
}
