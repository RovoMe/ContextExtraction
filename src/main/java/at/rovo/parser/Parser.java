package at.rovo.parser;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

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
	
	/** Defines the output target of the parser **/
	private ParseTarget target = ParseTarget.DOM;
	
	/** Specifies if certain tokens should be erased before generating the output **/
	private boolean cleanTokens = true;
	/** Specifies if the erased tags should be removed completely or just the 
	 * content of those tags**/
	private boolean cleanFully = false;
	/** Specifies if words inside a tag should be combined into a single 
	 * word-segment **/
	private boolean combineWords = false;
	/** Specifies if end-tags should be included in the output **/
	private boolean includeEndTags = false;
	/** Specifies if the endTags, if included, are on the same level as the 
	 * parent tag or included as a child of the opening tag **/
	private boolean childEndTag = false;
	
	public Parser()
	{
		
	}
	
	/**
	 * <p>Provides a possibility to change the output of the target. Currently
	 * the parser can output a DOM like sequence which contains structural 
	 * information such as parent of a {@link Tag} or the level, or just a simple</p>
	 * 
	 * @param target
	 */
	public void setParseTarget(ParseTarget target)
	{
		this.target = target;
	}
	
	public ParseTarget getParseTarget()
	{
		return this.target;
	}
	
	public void cleanTokens(boolean cleanTokens)
	{
		this.cleanTokens = cleanTokens;
	}
	
	public boolean isTokenCleaned()
	{
		return this.cleanTokens;
	}
	
	public void cleanFully(boolean cleanFully)
	{
		this.cleanFully = cleanFully;
	}
	
	public boolean isCleanedFully()
	{
		return this.cleanFully;
	}
	
	public void combineWords(boolean combineWords)
	{
		this.combineWords = combineWords;
	}
	
	public boolean isWordCombined()
	{
		return this.combineWords;
	}
	
	public void includeEndTags(boolean includeEndTags)
	{
		this.includeEndTags = includeEndTags;
	}
	
	public boolean isEndTagIncluded()
	{
		return this.includeEndTags;
	}
	
	public void childEndTag(boolean childEndTag)
	{
		this.childEndTag = childEndTag;
	}
	
	public boolean isChildEndTag()
	{
		return this.childEndTag;
	}
			
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
	public ParseResult tokenizeURL(String url, boolean formatText)
	{
		if (url != null && !url.equals(""))
		{
			if (logger.isDebugEnabled())
				logger.debug("Reading page from URL: "+url);
			
			UrlReader reader = new UrlReader();
			String html = reader.readPage(url);
			
			return this.tokenize(html, formatText);
		}
		else
			throw new IllegalArgumentException("Invalid URL passed. Got: "+url);
	}
	
	public String cleanPage(String html, boolean full)
	{
		// discard everything between <SCRIPT> and <STYLE> tags
		html = html.replaceAll("(?s)<![dD][oO][cC][tT][yY][pP][eE].*?>", "");
		html = html.replaceAll("(?s)<!--.*?-->", "");
		if (full)
		{
			html = html.replaceAll("(?s)<[sS][cC][rR][iI][pP][tT][^>]*?>.*?</[sS][cC][rR][iI][pP][tT]>", "");
			html = html.replaceAll("(?s)<[sS][tT][yY][lL][eE][^>]*?>.*?</[sS][tT][yY][lL][eE]>", "");
			html = html.replaceAll("(?s)<[nN][oO][sS][cC][rR][iI][pP][tT][^>]*?>.*?</[nN][oO][sS][cC][rR][iI][pP][tT]>", "");
			
			html = html.replaceAll("(?s)<[lL][iI][nN][kK][^>]*?>[^<]*?</[lL][iI][nN][kK]>", "");		
			html = html.replaceAll("(?s)<[lL][iI][nN][kK][^>]*?>", "");	
			
			// forms do not contain content too
			html = html.replaceAll("(?s)<[fF][oO][rR][mM](.*?)>.*?</[fF][oO][rR][mM]>", "");
			html = html.replaceAll("(?s)<[iI][nN][pP][uU][tT][^>]*?>.*?</[iI][nN][pP][uU][tT]>", "");
			html = html.replaceAll("(?s)<[iI][nN][pP][uU][tT][^>]*?>", "");
			html = html.replaceAll("(?s)<[sS][eE][lL][eE][cC][tT][^>]*?>.*?</[sS][eE][lL][eE][cC][tT]>","");
			html = html.replaceAll("(?s)<[sS][eE][lL][eE][cC][tT][^>]*?>","");
			
			html = html.replaceAll("(?s)<[iI][mM][gG][^>]*?>", "");
		}
		else
		{
			html = html.replaceAll("(?s)<[sS][cC][rR][iI][pP][tT][^>]*?>.*?</[sS][cC][rR][iI][pP][tT]>", "<script></script>");
			html = html.replaceAll("(?s)<[sS][tT][yY][lL][eE][^>]*?>.*?</[sS][tT][yY][lL][eE]>", "<style></style>");
			html = html.replaceAll("(?s)<[nN][oO][sS][cC][rR][iI][pP][tT][^>]*?>.*?</[nN][oO][sS][cC][rR][iI][pP][tT]>", "<noscript></noscript>");
			
			html = html.replaceAll("(?s)<[lL][iI][nN][kK][^>]*?>[^<]*?</[lL][iI][nN][kK]>", "<link/>");
			html = html.replaceAll("(?s)<[lL][iI][nN][kK][^>]*?>", "<link/>");
			
			// forms do not contain content too
			html = html.replaceAll("(?s)<[fF][oO][rR][mM](.*?)>.*?</[fF][oO][rR][mM]>", "<form$1></form>");
			html = html.replaceAll("(?s)<[iI][nN][pP][uU][tT][^>]*?>.*?</[iI][nN][pP][uU][tT]>", "<input/>");
			html = html.replaceAll("(?s)<[iI][nN][pP][uU][tT][^>]*?>", "<input/>");
			html = html.replaceAll("(?s)<[sS][eE][lL][eE][cC][tT][^>]*?>.*?</[sS][eE][lL][eE][cC][tT]>"," <select></select>");
			html = html.replaceAll("(?s)<[sS][eE][lL][eE][cC][tT][^>]*?>","<select></select>");
		}
		
		// HTML error-tag cleaning

		// in case > and < are used to point to an entry divide it from the tag ending
		html = html.replaceAll(">>", "> >");
		html = html.replaceAll("><", "> <");
		// split the content from following tags
		html = html.replaceAll("(?s)>([^>]*?)<", ">$1\n<");
		// split the content from preceding tags
		html = html.replace(">([^ ]*?)", ">\n$1");
		// replace multiple whitespace characters after a tag-end symbol
		html = html.replaceAll(">([^\\s]+)", ">\n$1");
		// replace multiple whitespace characters between a tag-end symbol and a word-beginning
		html = html.replaceAll(">[^\\w|\\S]*(\\w+)", ">\n$1");
		// replace multiple whitespace characters with a blank
		html = html.replaceAll("[\\s]+", " ");
		// remove gap or whitespace in the middle of a tag-attribute inside a quoted section
		html = html.replaceAll("(<[^>|\\\"]*\\\"[^\\\"]*)\\s+([^\\\"]*\\\">)", "$1$2");			
				
		// <a href="..." />test</a> - removes the inline closer /
		html = html.replaceAll("(?s)<([a-zA-Z0-9_]+?)([^>]*?)/>(.*?)</\\1>", "<$1$2>$3</$1>");
		// adds a closing </li> tag if one is missing between two opening <li..> tags
		// f.e: <ul><li>...</li><li>...<li>...</li><li>...</ul> - 2nd and last <li> 
		// are missing a closing tag
		html = html.replaceAll("(?s)<li([^>]*?)>([^</li>]*?)(<li([^>]*?)>|</ul>)", "<li$1>$2</li>$3");
		
		return html;
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
	public ParseResult tokenize(String html, boolean formatText)
	{
		ParseResult result = new ParseResult();
		String[] tokens;
		if (html == null || html.equals(""))
			throw new IllegalArgumentException("Invalid html string passed.");
		
 		if (this.cleanTokens)
 		{
 			html = this.cleanPage(html, this.cleanFully);
 		}
 		
 		if (logger.isInfoEnabled())
 			logger.info(html);
		
		// split the html into a token-array
		if (logger.isDebugEnabled())
			logger.debug("Splitting page");
 		tokens = html.split(" ");
 		 			
 		// Meta-data informations
 		boolean isTitle = false;
 		String title = "";
 		boolean isAuthorName = false;
 		List<String> authorName = new ArrayList<String>();
 		boolean isAuthor = false;
 		List<String> authors = new ArrayList<String>();
 		boolean isDate = false;
 		String date = "";
 		boolean isByline = false;
 		String bylineTag = null;
 		String byline = "";
		
		List<Token> tokenList = new ArrayList<Token>();
		Stack<Token> stack = new Stack<Token>();
		Word lastWord = null;
		Tag tag = null;
		int tokenPos = 0;
		int id = 0;
		int numWords = 0;
		if (!childEndTag)
			stack.add(new Tag(0, "", 0, 0, 0));
		for (int i=0; i<tokens.length; i++)
		{
			// discard empty tokens
			if (tokens[i].trim().equals(""))
				continue;
			
			// starting token found - check if not an existing token already exists
			// this is necessary to bump parts of comments into these tags
			if (tokens[i].startsWith("<") && tag == null)
			{
				tag = new Tag(tokens[i]);
				// do not add empty tags
				if (tag.getShortTag().equals(""))
				{
					tag = null;
					continue;
				}
				tag.setIndex(tokenPos++);
				
				if (ParseTarget.DOM.equals(target))
				{
					lastWord = null;
					// catches end-tags and omits them from being added to the 
					// tokenList and show up in the final DOM-tree
					if (!includeEndTags && tokens[i].startsWith("</"))
					{ 
						stack.peek().setParentEndNo(id);
						if (!stack.isEmpty())
							checkElementsOnStack(tokens[i], stack);
						tag = null;
						continue;
					}
				}
				
				Tag node = null;
				int no;
				String tagName = "<"+(!tag.isOpeningTag() && !tag.isInlineCloseingTag() ? "/" : "")
						+tag.getShortTag()+(tag.isInlineCloseingTag() ? "/" : "") + ">";
				if (!stack.isEmpty() && stack.peek() != null)
				{
					no = stack.peek().getNo();
					int level = stack.size();
					if (!childEndTag && tagName.startsWith("</"))
						level--;
					if (!childEndTag)
						level--;
					if (stack.peek().getChildren() != null)
						node = new Tag(id++, tagName, level, no, stack.peek().getChildren().length);
					else
						node = new Tag(id++, tagName, level, no, 0);
				}
				else
				{
					node = new Tag(id++, tagName, 0, 0, 0);
					no = 0;
				}
				node.setHTML(tagName);
				
				boolean addTag = true;
				if (!childEndTag && (tokens[i].startsWith("</") || tokens[i].endsWith("/>")) && !stack.isEmpty())
				{
					if (checkElementsOnStack(node, stack, tokenList, childEndTag))
					{
						id--;
						addTag = false;
					}
				}
				
				if (addTag)
				{
					// add child to the parent
					if (tokenList.size() > no && !stack.isEmpty())
						tokenList.get(no).addChild(node);
					if (!tokens[i].startsWith("</") && !tokens[i].trim().endsWith("/>") 
							&& !tokens[i].equals("<hr>") && !tokens[i].equals("<br>"))
						stack.add(node);
					tokenList.add(node);
				}
				
				if (childEndTag && tokens[i].startsWith("</") && !stack.isEmpty())
					if (checkElementsOnStack(node, stack, tokenList, childEndTag))
						id--;
				
				if (logger.isDebugEnabled())
					logger.debug("\tadded Tag: "+tokens[i]);

				// collect meta-data
				
				if (tag.getHTML().equals("<title>"))
					isTitle = true;
				else if (tag.getHTML().equals("</title>"))
					isTitle = false;
				
				if (tag.getHTML().contains("byline"))
				{
					isByline = true;
					byline = tag.getHTML();
					bylineTag = tag.getShortTag();
				}
				
				if ((tag.isOpeningTag() && tag.getHTML().contains("date")))
					isDate = true;
				else if (isDate)
					isDate = false;
				if ((tag.isOpeningTag() && tag.getHTML().contains("\"authorName\"")))
				{
					authors.add("");
					isAuthorName = true;
				}
				else if (tag.isOpeningTag() && tag.getHTML().contains("\"author\""))
				{
					authors.add("");
					isAuthor = true;
				}
				else if (isAuthorName)
					isAuthorName = false;
				else if (isAuthor)
					isAuthor = false;
				
				// one-part tag found: <i>
				if (tag.getHTML().endsWith(">"))
					tag = null;
			}
			// an ordinary tag was found
			else if (tag != null && tag.getHTML().startsWith("<"))
			{
				// Tag is smart enough to recognize if it is a comment or an ordinary tag
				if (!tag.isValid())
				{
					if (logger.isDebugEnabled())
						logger.debug("\t   appending to Tag: "+tag.getHTML()+" + "+tokens[i]);
					tag.append(tokens[i]);
					
					// extract meta-data
					
					if (tokens[i].contains("date"))
						isDate = true;
					if (tokens[i].contains("\"authorName\""))
					{
						authorName.add("");
						isAuthorName = true;
					}
					else if (tokens[i].contains("\"author\""))
					{
						authors.add("");
						isAuthor = true;
					}
					else if (tag.getHTML().contains("byline"))
						isByline = true;
				}
				
				if (tag.getHTML().equals("</title>"))
					isTitle = false;
				// set flag for date-values to false if a tag is closed while the 
				// flag is set to open
				if (!tag.isOpeningTag() && isDate)
					isDate = false;
				if (!tag.isOpeningTag() && isAuthorName)
					isAuthorName = false;
				if (!tag.isOpeningTag() && isAuthor)
					isAuthor = false;
				if (!tag.isOpeningTag()  && isByline)
				{
					byline += tag.getHTML();
					if (tag.getShortTag().equals(bylineTag))
						isByline = false;
				}
				
				if (ParseTarget.DOM.equals(target))
				{
					stack.peek().setHTML(tag.getHTML());
					
					if (tag.getHTML().endsWith("/>"))
						stack.pop();
				}
				
				if (tag.isValid())
					tag = null;
			}
			else
			{	
				// we found a word - format it
				if (!tokens[i].trim().equals(""))
				{
					if (isTitle)
						title += " "+tokens[i];
					if (isDate)
						date += " "+tokens[i];
					if (isAuthorName)
						authorName.set(authorName.size()-1, (authorName.get(authorName.size()-1)+" "+tokens[i]).trim());
					if (isAuthor)
						authors.set(authors.size()-1, (authors.get(authors.size()-1)+" "+tokens[i]).trim());
					if (isByline)
						byline += " "+tokens[i];
					
					String word = tokens[i].trim();
					// 'U.S.' will convert to 'U S'
					word = word.replaceAll(" ", "");
					if (ParseTarget.DOM.equals(target))
					{
						if (!combineWords || combineWords && lastWord == null)
						{
							Word node = null;
							int no;
							if (!stack.isEmpty() && stack.peek() != null)
							{
								no = stack.peek().getNo();
								int level = stack.size();
								if (!childEndTag)
									level--;
								if (stack.peek().getChildren() != null)
									node = new Word(id++, word, level, no, stack.peek().getChildren().length);
								else
									node = new Word(id++, word, level, no, 0);
							}
							else
							{
								no = 0;
								node = new Word(id++, word, 0, 0, 0);
							}
							
							// add child to the parent
							if (tokenList.size() > no)
								tokenList.get(no).addChild(node);
							tokenList.add(node);
							lastWord = node;
						}
						else
						{
							lastWord.setText(lastWord.getText()+" "+word);
						}
						
						lastWord.setName(lastWord.getText());
					}
					else if (ParseTarget.NONE.equals(target))
					{
						if (word.contains("/") && !word.startsWith("http://"))
						{
							for (String w : word.split("/"))
							{
								addWord(w, tokenList, tokenPos, formatText);
							}
						}
						else if (word.contains("-"))
						{
							for (String w : word.split("-"))
							{
								addWord(w, tokenList, tokenPos, formatText);
							}
						}
						else
						{
							addWord(word, tokenList, tokenPos, formatText);
						}
					}
				}
			}
		}
		
		result.setTitle(title);
		result.setParsedTokens(tokenList);
		result.setAuthorName(authorName);
		result.setAuthors(authors);
		result.setPublishDate(date);
		result.setByline(byline);
		return result;
	}
	
	/**
	 * <p>Checks if a HTML node has a corresponding parent on the stack. If so
	 * nodes are taken from the stack until the parent is reached. The parent is
	 * now the last entry on the stack.</p>
	 * 
	 * @param node The String representation of the end tag node to check if a 
	 *             corresponding parent is on the stack
	 * @param stack The stack that includes all ancestors
	 * @return Returns true if the element is a wild node and has no ancestor 
	 *         on the stack, false otherwise
	 */
	private boolean checkElementsOnStack(String node, Stack<Token> stack)
	{
		for (int i=stack.size()-1; i>=0; i--)
		{
			Token curNode = stack.elementAt(i);
			if (curNode.getName().startsWith(node.replace("/", "")))
			{
				// match found
				int numPopRequired = stack.size()-1 - curNode.getLevel();
				for (int j=0; j<numPopRequired; j++)
					stack.pop();
				return false;
			}
		}
		return true;
	}
	
	/**
	 * <p>Checks if a HTML node has a corresponding parent on the stack. If so
	 * nodes are taken from the stack until the parent is reached. The parent is
	 * now the last entry on the stack.</p>
	 * <p>If no matching parent could be found, the algorithm assumes that the
	 * tag itself is a wild tag and should not be included in the final output,
	 * therefore the tag is removed from the tokenList and the reference of the
	 * parent pointing to this node is removed.</p>
	 * 
	 * @param node The node to check if a corresponding parent is on the stack
	 * @param stack The stack that includes all ancestors
	 * @param tokenList The list containing all HTML nodes
	 * @param childEndTag Defines if the end tag is on the same level as the start 
	 *                    tag (true) or the end tag is a child of the start tag 
	 *                    (false)
	 * @return Returns true if the element is a wild node and has no ancestor 
	 *         on the stack, false otherwise
	 */
	private boolean checkElementsOnStack(Tag node, Stack<Token> stack, List<Token> tokenList, boolean childEndTag)
	{
		for (int i=stack.size()-1; i>=0; i--)
		{
			Token curNode = stack.elementAt(i);
			if (curNode.getName().equals(node.getName().replace("/", "")))
			{
				// match found
				int numPopRequired;
				if (childEndTag)
					numPopRequired = node.getLevel() - curNode.getLevel();
				else
					numPopRequired = node.getLevel()+1 - curNode.getLevel();
				for (int j=0; j<numPopRequired; j++)
					stack.pop();
				return false;
			}
		}
		// node was not found, remove it from the tokenList and its parent
		if (tokenList.get(tokenList.size()-1).equals(node))
		{
			// delete the reference in the parent tag
			tokenList.get(node.getParentNo()).removeChild(node);
			// remove the node from the tokenList
			tokenList.remove(tokenList.size()-1);
			System.err.println("WARNING: Removing "+node.getName()+" from the tokenList");
			return true;
		}
		else if (!childEndTag && !node.getName().endsWith("/>"))
		{
			// delete the reference in the parent tag
			tokenList.get(node.getParentNo()).removeChild(node);
			System.err.println("WARNING: Removing "+node.getName()+" from the tokenList");
			return true;
		}
		return false;
	}
	
	/**
	 * <p>Adds a word to the internal {@link List} that keeps track of the 
	 * current tokens.</p>
	 * 
	 * @param word The word to add to the token list
	 * @param tokenList The list containing all parsed tokens
	 * @param tokenPos The position of the token within the list
	 * @param formatText Specifies if the word should be formated with the 
	 *                   stem-algorithm of Porter
	 * @return The index of the newly added word
	 */
	private int addWord(String word, List<Token> tokenList, int tokenPos, boolean formatText)
	{
		if (formatText)
			word = Parser.formatText(word).trim();
		else
			word = word.trim();
		if (!word.equals(""))
		{
			if (logger.isDebugEnabled())
				logger.debug("\tadding Word: '"+word+"'");
			Word _w = new Word(word);
			_w.setIndex(tokenPos++);
			tokenList.add(_w);
		}
		return tokenPos;
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
		// remove - sign in front of numbers and stem the word to 1
		text = text.replaceAll("^-?\\d+([.|,]\\d+)?", "1");
		// remove HTML encodings
		text = text.replaceAll("&#.+?;", "");
		text = text.replaceAll("&.+?;", "");
		// remove multiplicity
		text = text.replaceAll("'s", "");
		// replace all non-word characters
		text = text.replaceAll("[^a-zA-Z0-9]", "");
		// Apply Porter's stemming algorithm
		text = PorterStemmer.stem(text.trim());
		return text;
	}
}
