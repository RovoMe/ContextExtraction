package at.rovo.parser;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class TSReCParser extends Parser
{
	private List<String> textFlowBreakingTags = null;
	
	public TSReCParser()
	{
		super();
		
		this.loadTextFlowBreakingTags();
	}
	
	private void loadTextFlowBreakingTags()
	{
		this.textFlowBreakingTags = new ArrayList<String>();
		
		this.textFlowBreakingTags.add("div");
		this.textFlowBreakingTags.add("ul");
		this.textFlowBreakingTags.add("li");
		this.textFlowBreakingTags.add("p");
		this.textFlowBreakingTags.add("form");
		this.textFlowBreakingTags.add("td");
		this.textFlowBreakingTags.add("br");
		this.textFlowBreakingTags.add("h1");
		this.textFlowBreakingTags.add("h2");
		this.textFlowBreakingTags.add("h3");
		this.textFlowBreakingTags.add("h4");
		this.textFlowBreakingTags.add("h5");
		this.textFlowBreakingTags.add("h6");
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
					// add child to the parent if it isn't the end-tag
					if (tokenList.size() > parent && !stack.isEmpty() 
							&& !tokens[i].startsWith("</") && !tokens[i].endsWith("/>"))
						tokenList.get(parent).addChild(node);
					
					if (!tokens[i].startsWith("</") && !tokens[i].endsWith("/>") 
							&& !this.ignoreParentingTags.contains(node.getShortTag().toLowerCase()))
						stack.add(node);
					else
						node.setEndNo(id-1);
					
					tokenList.add(node);
					if (logger.isDebugEnabled())
						logger.debug("\tadded Tag: "+tokens[i]);
					
					// collect meta-data
					tag.setLevel(node.getLevel());
					metaData.checkTag(tag);
				}
						
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
									
				if (tag.isValid())
					tag = null;
			}
			else
			{	
				// we found a word - format it
				if (!tokens[i].trim().equals(""))
				{					
					String word = tokens[i].trim();

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
}
