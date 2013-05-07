package at.rovo.parser;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import at.rovo.UrlReader;
import at.rovo.stemmer.PorterStemmer;


/**
 * <p>A parser analyzes text and does something with the provided text. This class
 * divides a provided {@link String} into {@link Token}s - namely {@link Tag}s and 
 * {@link Word}s.</p>
 * <p>Therefore the text is first slightly modified (tag endings are separated by 
 * the next following token by a blank and content between &lt;script> or &lt;style> 
 * tags is removed) and then split into an array which is used to build a token list 
 * that includes all {@link Token}s of the provided string.</p>
 * 
 * @author Roman Vottner
 */
public class Parser 
{
	private static Logger logger = LogManager.getLogger(Parser.class.getName());
			
	/**
	 * <p>Builds a {@link List} of {@link Token}s representing the page referenced
	 * by the URL provided.</p>
	 * <p>This method fetches the content of the URL provided and hands it
	 * over to {@link #tokenize(String)} method.</p>
	 *  
	 * @param html A {@link String} representing the URL of the page to 
	 *             split up into tokens
	 * @param formatText Indicates if the output tokens should be formated
	 * @return A {@link List} of {@link Token}s representing the HTML page
	 */
	public static List<Token> tokenizeURL(String url, boolean formatText)
	{
		if (url != null && !url.equals(""))
		{
			logger.debug("Reading page from URL: "+url);
			UrlReader reader = new UrlReader();
			String html = reader.readPage(url);
			return Parser.tokenize(html, formatText);
		}
		else
			throw new IllegalArgumentException("Invalid URL passed. Got: "+url);
	}
	
	/**
	 * <p>Builds a {@link List} of {@link Token}s representing the provided
	 * string.</p>
	 * <p>First, this method removes everything between &lt;script> and &lt;style>
	 * tags and splits tags from words by inserting a blank after the tag-closer. 
	 * Next, the string is split into an array.</p>
	 * <p>This array is now used to divide tokens into {@link Tag}s and {@link Word}s
	 * which are now stored in a {@link List} and returned.</p>
	 *  
	 * @see String#split(String)
	 * @param html A {@link String} representing the full HTML code of a
	 *             web site
	 * @param formatText Indicates if the tokens should be formated or not
	 * @return A {@link List} of {@link Token}s representing the HTML page
	 */
	public static List<Token> tokenize(String html, boolean formatText)
	{
		String[] tokens;
		if (html == null || html.equals(""))
			throw new IllegalArgumentException("Invalid html string passed.");
		
		logger.debug("Preparing page for token splitting");
		// discard everything between <SCRIPT> and <STYLE> tags
		html = html.replaceAll("<[sS][cC][rR][iI][pP][tT](.*?)>.*?</[sS][cC][rR][iI][pP][tT]>", ""); // "<script$1></script>");
		html = html.replaceAll("<[sS][tT][yY][lL][eE](.*?)>.*?</[sS][tT][yY][lL][eE]>", ""); // "<style$1></style>");
		// forms do not contain content too
		html = html.replaceAll("<[fF][oO][rR][mM](.*?)>.*?</[fF][oO][rR][mM]>", ""); // <form$1></form>");
		// generate a blank after a tag-closer
		html = html.replaceAll(">([^ ]+?)", "> $1");
		// remove blanks before a tag-closer
		html = html.replaceAll("([^ ]+?) +>", "$1>");
		// divide words from tag-starters
		html = html.replaceAll("([^ ]\\w?)<", "$1 <");
		// remove leading blanks as they result in errors later on
		html = html.replaceAll("^ +", "");
		// in case > and < are used to point to an entry divide it from the tag ending
		html = html.replaceAll(">>", "> >");
		html = html.replaceAll("><", "> <");
		// html = html.replaceAll("([^ ]+?)/>", "$1 />");
		// split the html into a token-array
		logger.debug("Splitting page");
 		tokens = html.split(" ");
		
		List<Token> tokenList = new ArrayList<Token>();
		Token token = null;
//		int numTokens = 0;
		for (int i=0; i<tokens.length; i++)
		{
			// discard empty tokens
			if (tokens[i].trim().equals(""))
				continue;
			
			// starting token found - check if not an existing token already exists
			// this is necessary to bump parts of comments into these tags
			if (tokens[i].startsWith("<") && token == null)
			{
				token = new Tag(tokens[i]);
				// do not add empty tags
				if (((Tag)token).getShortTag().equals(""))
					continue;
//				token.setIndex(numTokens++);
				tokenList.add(token);
				logger.debug("\tadded Tag: "+tokens[i]);
				// one-part tag found: <i>
				if (token.getText().endsWith(">"))
					token = null;
			}
			// an ordinary tag was found
			else if (token != null && token.getText().startsWith("<") && token instanceof Tag)
			{
				Tag tag = (Tag)token;
				// Tag is smart enough to recognize if it is a comment or an ordinary tag
				if (!tag.isValid())
				{
					logger.debug("\t   appending to Tag: "+tag.getText()+" + "+tokens[i]);
					tag.append(tokens[i]);
				}
				if (tag.isValid())
					token = null;
			}
			else
			{	
				// we found a word - format it
				if (!tokens[i].trim().equals(""))
				{
					String word = tokens[i].trim();
					// 'U.S.' will convert to 'U S'
					word = word.replaceAll(" ", "");
					if (word.contains("/") && !word.startsWith("http://"))
					{
						for (String w : word.split("/"))
						{
							if (!w.trim().equals(""))
							{
								logger.debug("\tadding Word: '"+w+"'");
								Word _w = new Word(w);
//								_w.setIndex(numTokens++);
								tokenList.add(_w);
							}
						}
					}
					else if (word.contains("-"))
					{
						for (String w : word.split("-"))
						{
							if (!w.trim().equals(""))
							{
								logger.debug("\tadding Word: '"+w+"'");
								Word _w = new Word(w);
//								_w.setIndex(numTokens++);
								tokenList.add(_w);
							}
						}
					}
					else
					{
						if (formatText)
							word = Parser.formatText(word).trim();
						else
							word = word.trim();
						if (!word.equals(""))
						{
							logger.debug("\tadding Word: '"+word+"'");
							Word _w = new Word(word);
//							_w.setIndex(numTokens++);
							tokenList.add(_w);
						}
					}
				}
			}
		}
		
		return tokenList;
	}
	
	/**
	 * <p>Formats text removing certain characters or symbols</p>
	 * <p>Stemming is applied here:</p>
	 * <ul>
	 *   <li>Porter's stemming algorithm is applied to non-numeric words</li>
	 *   <li>Numeric words (numbers) are stemmed to 1</li>
	 * </ul>
	 * 
	 * @param text Text which should get formated
	 * @return the formated text
	 */
	public static String formatText(String text)
	{
		// leave URLs as they are
		if (text.startsWith("http://"))
			return text;
		// split words which are combined via a hyphen
//		text = text.replaceAll("([^-]+?)-(^-]+?)", "$1 $2");
		// remove - sign in front of numbers
		text = text.replaceAll("^-([0-9]+?)", "$1");
		// remove HTML encodings
		text = text.replaceAll("&#.+?;", "");
		text = text.replaceAll("&.+?;", "");
		// remove multiplicity
		text = text.replaceAll("'s", "");
		// replace all non-word characters; leave . in the text to split 
		// the end of one line from the start of the next line in case the
		// last word contained a special character at the end of the word.
		// f.e.: legend'.Speaking 
		text = text.replaceAll("[^a-zA-Z0-9\\. ]", "");
		// now split the words
//		text = text.replaceAll("([a-zA-Z]+?)\\.+([a-zA-Z0-9]+?)", "$1 $2");
		// and remove all .
		text = text.replaceAll("\\.", "");
		// Apply Porter's stemming algorithm
		text = PorterStemmer.stem(text.trim());
		// all numbers are stemmed to 1
		text = text.replaceAll("[0-9]+", "1");
		return text;
	}
}
