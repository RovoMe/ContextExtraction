package at.rovo.parser;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class DOMParser extends Parser
{
	List<String> ignoreTags = new ArrayList<String>();
	
	public DOMParser()
	{
		super();
		
		this.ignoreTags.add("hr");
		this.ignoreTags.add("br");
		this.ignoreTags.add("meta");
		this.ignoreTags.add("link");
	}
	
	public void addTagToIgnore(String tagName)
	{
		if (!this.ignoreTags.contains(tagName))
			this.ignoreTags.add(tagName);
	}
	
	public void removeTagToIgnore(String tagName)
	{
		if (this.ignoreTags.contains(tagName))
			this.ignoreTags.remove(tagName);
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
	@Override
	public ParseResult tokenize(String html, boolean formatText)
	{
		ParseResult result = new ParseResult();
		String[] tokens;
		if (html == null || html.equals(""))
			throw new IllegalArgumentException("Invalid html string passed.");
		
 		if (this.cleanTokens)
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
		Integer id = 0;
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
				
				// catches end-tags and omits them from being added to the 
				// tokenList and show up in the final DOM-tree
				if (tokens[i].startsWith("</"))
				{ 
					stack.peek().setEndNo(id);
					if (!stack.isEmpty())
						checkElementsOnStack(tokens[i], stack);
					tag = null;
					continue;
				}
				
				Tag node = null;
				int parent;
				String tagName = "<"+(!tag.isOpeningTag() && !tag.isInlineCloseingTag() ? "/" : "")
						+tag.getShortTag()+(tag.isInlineCloseingTag() ? "/" : "") + ">";
				if (!stack.isEmpty() && stack.peek() != null)
				{
					parent = stack.peek().getNo();
					int level = stack.size()-1;
					if (stack.peek().getChildren() != null)
						node = new Tag(id++, tagName, level, parent, stack.peek().getChildren().length);
					else
						node = new Tag(id++, tagName, level, parent, 0);
				}
				else
				{
					node = new Tag(id++, tagName, 0, 0, 0);
					parent = 0;
				}
				node.setHTML(tagName);

				// add child to the parent
				if (tokenList.size() > parent && !stack.isEmpty())
					tokenList.get(parent).addChild(node);
				if (!tokens[i].startsWith("</") && !tokens[i].trim().endsWith("/>") 
						&& !this.ignoreTags.contains(node.getShortTag()))
					stack.add(node);
				else
					node.setEndNo(id-1);
				
				tokenList.add(node);
				if (logger.isDebugEnabled())
					logger.debug("\tadded Tag: "+tokens[i]);
		
				// collect meta-data
				tag.setLevel(node.getLevel());
				metaData.checkTag(node);
				
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
				
				tokenList.get(tokenList.size()-1).setHTML(tag.getHTML());
				
				if (tag.getHTML().endsWith("/>") && 
						!this.ignoreTags.contains(tag.getShortTag()))
					stack.pop();
				
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
					metaData.checkToken(lastWord);
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
}
