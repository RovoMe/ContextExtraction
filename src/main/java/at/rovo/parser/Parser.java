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
	protected static Logger logger = LogManager.getLogger(Parser.class.getName());
	
	/** Specifies if the erased tags should be removed completely or just the 
	 * content of those tags**/
	protected boolean cleanFully = false;
	/** Specifies if words inside a tag should be combined into a single 
	 * word-segment **/
	protected boolean combineWords = false;
	
	protected List<String> ignoreParentingTags = new ArrayList<String>();
	
	private boolean cleanMeta = false;
	private boolean cleanLinks = true;
	private boolean cleanScripts = true;
	private boolean cleanStyles = true;
	private boolean cleanFormElements = true;
	private boolean cleanImages = false;
	private boolean cleanAnchors = false;
		
	public Parser()
	{
		this.ignoreParentingTags.add("hr");
		this.ignoreParentingTags.add("br");
		this.ignoreParentingTags.add("meta");
		this.ignoreParentingTags.add("link");
		this.ignoreParentingTags.add("img");
	}
	
	public void cleanMeta(boolean clean) { this.cleanMeta = clean; }
	public void cleanLinks(boolean clean) { this.cleanLinks = clean; }
	public void cleanScripts(boolean clean) { this.cleanScripts = clean; }
	public void cleanStyles(boolean clean) { this.cleanStyles = clean; }
	public void cleanFormElements(boolean clean) { this.cleanFormElements = clean; }
	public void cleanImages(boolean clean) { this.cleanImages = clean; }
	public void cleanAnchors(boolean clean) { this.cleanAnchors = clean; }
	
	public boolean cleanMeta() { return this.cleanMeta; }
	public boolean cleanLinks() { return this.cleanLinks; }
	public boolean cleanScripts() { return this.cleanScripts; }
	public boolean cleanStyles() { return this.cleanStyles; }
	public boolean cleanFormElements() { return this.cleanFormElements; }
	public boolean cleanImages() { return this.cleanImages; }
	public boolean cleanAnchors() { return this.cleanAnchors; }
	
	public void addTagToIgnoreForParenting(String tagName)
	{
		if (!this.ignoreParentingTags.contains(tagName))
			this.ignoreParentingTags.add(tagName);
	}
	
	public void removeTagToIgnoreForParenting(String tagName)
	{
		if (this.ignoreParentingTags.contains(tagName))
			this.ignoreParentingTags.remove(tagName);
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
			if (this.cleanMeta)
				html = html.replace("(?s)<[mM][eE][tT][aA][^>]*?[/]?>", "");
			
			if (this.cleanScripts)
			{
				html = html.replaceAll("(?s)<[sS][cC][rR][iI][pP][tT][^>]*?>.*?</[sS][cC][rR][iI][pP][tT]>", "");
				html = html.replaceAll("(?s)<[nN][oO][sS][cC][rR][iI][pP][tT][^>]*?>.*?</[nN][oO][sS][cC][rR][iI][pP][tT]>", "");
			}
			if (this.cleanStyles)
				html = html.replaceAll("(?s)<[sS][tT][yY][lL][eE][^>]*?>.*?</[sS][tT][yY][lL][eE]>", "");
			
			if (this.cleanLinks)
			{
				html = html.replaceAll("(?s)<[lL][iI][nN][kK][^>]*?>[^<]*?</[lL][iI][nN][kK]>", "");		
				html = html.replaceAll("(?s)<[lL][iI][nN][kK][^>]*?>", "");	
			}
			
			// forms do not contain content too
			if (this.cleanFormElements)
			{
				html = html.replaceAll("(?s)<[fF][oO][rR][mM](.*?)>.*?</[fF][oO][rR][mM]>", "");
				html = html.replaceAll("(?s)<[iI][nN][pP][uU][tT][^>]*?>.*?</[iI][nN][pP][uU][tT]>", "");
				html = html.replaceAll("(?s)<[iI][nN][pP][uU][tT][^>]*?>", "");
				html = html.replaceAll("(?s)<[sS][eE][lL][eE][cC][tT][^>]*?>.*?</[sS][eE][lL][eE][cC][tT]>","");
				html = html.replaceAll("(?s)<[sS][eE][lL][eE][cC][tT][^>]*?>","");
			}
			
			if (this.cleanImages)
				html = html.replaceAll("(?s)<[iI][mM][gG][^>]*?>", "");
		}
		else
		{
			if (this.cleanMeta)
				html = html.replace("(?s)<[mM][eE][tT][aA][^>]*?[/]?>", "<meta />");
			
			if (this.cleanScripts)
			{
				html = html.replaceAll("(?s)<[sS][cC][rR][iI][pP][tT][^>]*?>.*?</[sS][cC][rR][iI][pP][tT]>", "<script> </script>");
				html = html.replaceAll("(?s)<[nN][oO][sS][cC][rR][iI][pP][tT][^>]*?>.*?</[nN][oO][sS][cC][rR][iI][pP][tT]>", "<noscript> </noscript>");
			}
			if (this.cleanStyles)
				html = html.replaceAll("(?s)<[sS][tT][yY][lL][eE][^>]*?>.*?</[sS][tT][yY][lL][eE]>", "<style> </style>");
			
			
			if (this.cleanLinks)
			{
				html = html.replaceAll("(?s)<[lL][iI][nN][kK][^>]*?>[^<]*?</[lL][iI][nN][kK]>", "<link> </link>");
				html = html.replaceAll("(?s)<[lL][iI][nN][kK][^>]*?>", "<link />");
			}
			
			// forms do not contain content too
			if (this.cleanFormElements)
			{
				html = html.replaceAll("(?s)<[fF][oO][rR][mM](.*?)>.*?</[fF][oO][rR][mM]>", "<form$1> </form>");
				html = html.replaceAll("(?s)<[iI][nN][pP][uU][tT][^>]*?>.*?</[iI][nN][pP][uU][tT]>", "<input />");
				html = html.replaceAll("(?s)<[iI][nN][pP][uU][tT][^>]*?>", "<input />");
				html = html.replaceAll("(?s)<[sS][eE][lL][eE][cC][tT][^>]*?(?<!/)>.*?</[sS][eE][lL][eE][cC][tT]>"," <select> </select>");
				html = html.replaceAll("(?s)<[sS][eE][lL][eE][cC][tT][^>]*?/>","<select />");
				
				if (this.cleanImages)
					html = html.replaceAll("(?s)<[iI][mM][gG][^>]*?>", "<img />");
			}
		}
				
		if (this.cleanAnchors)
			html = html.replaceAll("(?s)<a [^>]*?>([^<])*?</a>", "$1");
		
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
		html = html.replaceAll("(?s)<li([^n][^k][^>]*?)>((.(?!</li>|</ul>|<ul))*)(<li([^>]*?)>|</ul>)", "<li$1>$2</li> $4");
		
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
		
 		html = this.cleanPage(html, this.cleanFully);
		
		// split the html into a token-array
		if (logger.isDebugEnabled())
			logger.debug("Splitting page");
 		tokens = html.split(" ");
 		 			
 		// Meta-data informations
 		ParsingMetaData metaData = new ParsingMetaData();
		
		List<Token> tokenList = new ArrayList<Token>();
		Stack<Token> stack = new Stack<Token>();
		Word lastWord = null;
		Tag tag = null;
		int tokenPos = 0;
		int id = 0;
		int numWords = 0;

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
				
				lastWord = null;
								
				Tag node = null;
				int parent;
				String tagName = "<"+(!tag.isOpeningTag() && !tag.isInlineCloseingTag() ? "/" : "")
						+tag.getShortTag()+(tag.isInlineCloseingTag() ? "/" : "") + ">";
				if (!stack.isEmpty() && stack.peek() != null)
				{
					parent = stack.peek().getNo();
					int level = stack.size()-1;
					if (tagName.startsWith("</"))
					{
						level--;
						parent = tokenList.get(parent).getParentNo();
					}
					
					if (logger.isDebugEnabled())
					{
						StringBuilder builder = new StringBuilder();
						for (int _i=0; _i<level; _i++)
							builder.append("\t");
						logger.debug(builder.toString()+tagName+" id: "+id+" parent: "+parent);
					}
					
					if (stack.peek().getChildren() != null)
						node = new Tag(id++, tagName, parent, stack.peek().getChildren().length, level);
					else
						node = new Tag(id++, tagName, parent, 0, level);
				}
				else
				{
					node = new Tag(id++, tagName, 0, 0, 0);
					parent = 0;
				}
				node.setHTML(tagName);
				
				boolean addTag = true;
				if ((tokens[i].startsWith("</") || tokens[i].endsWith("/>")) && !stack.isEmpty())
				{
					stack.peek().setEndNo(id-1);
					if (checkElementsOnStack(node, stack, tokenList))
					{
						id--;
						addTag = false;
					}
				}
				
				if (addTag)
				{
					// add child to the parent
					if (tokenList.size() > parent && !stack.isEmpty())
						tokenList.get(parent).addChild(node);
					if (!tokens[i].startsWith("</") && !tokens[i].trim().endsWith("/>") 
							&& !this.ignoreParentingTags.contains(node.getShortTag().toLowerCase()))
						stack.add(node);
					else
						node.setEndNo(id-1);
					
					tokenList.add(node);
					if (logger.isDebugEnabled())
						logger.debug("\tadded Tag: "+tokens[i]);
				}
					
				// collect meta-data
				tag.setLevel(node.getLevel());
				metaData.checkTag(tag);
				
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
				}
				
				metaData.checkTag(tag, tokens[i]);
				
				stack.peek().setHTML(tag.getHTML());
								
				if (tag.isValid())
					tag = null;
			}
			else
			{	
				// we found a word - format it
				if (!tokens[i].trim().equals(""))
				{					
					String word = tokens[i].trim();
					// 'U.S.' will convert to 'U S'
					word = word.replaceAll(" ", "");

					// As not a reference for an object but a value-copy of the 
					// reference is passed as argument, changes inside of a method
					// on a newly created object inside of a method are lost after
					// the return of the call!
					// This means if lastWord is defined as null before the method
					// call and gets assigned a new reference through a instantiating
					// a new object, this object is removed from the call stack
					// after the method returns and the old (null) value is restored
					if (lastWord == null)
					{
						lastWord = new Word("");
						lastWord.setText(null);
					}
					numWords = this.addWord(word, id, stack, tokenList, lastWord, formatText);
					metaData.checkToken(lastWord, this.combineWords);
					id += numWords;
					if (!this.combineWords)
						lastWord = null;
				}
			}
		}
		
		result.setTitle(metaData.getTitle());
		result.setParsedTokens(tokenList);
		result.setAuthorName(metaData.getAuthorNames());
		result.setAuthors(metaData.getAuthor());
		result.setPublishDate(metaData.getDate());
		result.setByline(metaData.getByline());
		result.setNumWords(numWords);
		result.setNumTokens(tokenList.size());
		result.setNumTags(id);
		
		return result;
	}

	protected int addWord(String word, int id, Stack<Token> stack, List<Token> tokenList, Word lastWord, boolean formatText)
	{
		int numWords = 0;
		
		if (formatText)
			word = formatText(word);
		
//		if ((word.contains("/") && !word.startsWith("http://")) 
//				|| word.contains("-"))
//		{
//			for (String w : word.split("[/|-]"))
//			{
//				numWords += this.addWord(w, id++,  stack,  tokenList, lastWord);
//			}
//		}
//		else
		{
			numWords += this.addWord(word, id,  stack,  tokenList, lastWord);
		}

		return numWords;
	}
	
	private int addWord(String word, int id, Stack<Token> stack, List<Token> tokenList, Word lastWord)
	{
		int ret = 0;
		if (!this.combineWords || (this.combineWords && (lastWord == null || lastWord.getText()==null) ))
		{
			int parent;
			if (!stack.isEmpty() && stack.peek() != null)
			{
				parent = stack.peek().getNo();
				int level = stack.size()-1;
				if (stack.peek().getChildren() != null)
				{
					if (lastWord == null)
						lastWord = new Word(id, word, parent, stack.peek().getChildren().length, level);
					else
					{
						lastWord.setNo(id);
						lastWord.setName(word);
						lastWord.setText(word);
						lastWord.setLevel(level);
						lastWord.setParentNo(parent);
						lastWord.setSibNo(stack.peek().getChildren().length);
					}
				}
				else
				{
					if (lastWord == null)
						lastWord = new Word(id, word, parent, 0, level);
					else
					{
						lastWord.setNo(id);
						lastWord.setName(word);
						lastWord.setText(word);
						lastWord.setLevel(level);
						lastWord.setParentNo(parent);
						lastWord.setSibNo(0);
					}
				}
			}
			else
			{
				parent = 0;
				if (lastWord == null)
					lastWord = new Word(id, word, 0, 0, 0);
				else
				{
					lastWord.setNo(id);
					lastWord.setName(word);
					lastWord.setText(word);
					lastWord.setLevel(0);
					lastWord.setParentNo(0);
					lastWord.setSibNo(0);
				}
			}
			
			// add child to the parent
			if (tokenList.size() > parent)
				tokenList.get(parent).addChild(lastWord);
			tokenList.add(lastWord);
							
			ret = 1;
		}
		else
		{
			lastWord.setText(lastWord.getText()+" "+word);
		}
		
		lastWord.setName(lastWord.getText());
		
		return ret;
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
	protected boolean checkElementsOnStack(Tag node, Stack<Token> stack, List<Token> tokenList)
	{
		// first element on the stack is the root-element
		for (int i=stack.size()-1; i>0; i--)
		{
			Token curNode = stack.elementAt(i);
			if (curNode.getName().equals(node.getName().replace("/", "")))
			{
				// match found
				int numPopRequired = node.getLevel()+1 - curNode.getLevel();
				for (int j=0; j<numPopRequired; j++)
					stack.pop();
				return false;
			}
		}
		System.err.println("WARNING: Ignoring "+node.getNo()+" "+node.getName());
		return true;
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
		text = text.replaceAll("[^a-zA-Z0-9\\-]", "");
		// Apply Porter's stemming algorithm
		text = PorterStemmer.stem(text.trim());
		return text;
	}
}
