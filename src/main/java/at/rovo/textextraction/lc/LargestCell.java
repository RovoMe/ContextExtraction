package at.rovo.textextraction.lc;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import at.rovo.UrlReader;
import at.rovo.parser.Parser;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.textextraction.ExtractionException;
import at.rovo.textextraction.TextExtractor;

/**
 * 
 * @author Roman Vottner
 */
public class LargestCell extends TextExtractor
{
	private static Logger logger = LogManager.getLogger(LargestCell.class.getName());
	
	public LargestCell()
	{
		
	}

	/**
	 * <p>This algorithm builds a stack for open tags and adds text which lies 
	 * between an opening and a closing tag to the open-tag on top of the stack. 
	 * Tags itself get a penalty-value whereas words (= non-tags) have a value 
	 * of 1.</p>
	 * <p>If a closing-tag is found the last open tag is taken from the stack
	 * and the value and text is added to the open tag.</p>
	 * <p>The tag with the highest value may be expected to contain the actual
	 * article we are interested in</p>
	 **/
	@Override
	public String predictText(String url) throws ExtractionException 
	{
		UrlReader reader = new UrlReader();
		String html = reader.readPage(url);
		if (html == null || html.equals(""))
		{
			logger.error("No html content available!");
			return null;
		}
		Parser parser = new Parser();
		parser.cleanFully(true);
		List<Token> htmlToken = parser.tokenize(html, false).getParsedTokens();
		
		// HTMLStack
		Stack<StackValue> tagStack = new Stack<StackValue>();
		long max = Long.MIN_VALUE;
		// tag which contains currently the maximal value (words count as 1 and tags as -10)
		StackValue maxVal = null;
		StackValue sv = null;
		
		for (Token token : htmlToken)
		{
			logger.debug("examin: "+token);
			if (token instanceof Tag)
			{
				Tag tag = (Tag)token;
				// content may be considered to rest inside <div> or <td> tags
				if (tag.isOpeningTag() && (
						tag.getShortTag().toLowerCase().equals("div") || 
						tag.getShortTag().toLowerCase().equals("td") ||
						tag.getShortTag().toLowerCase().equals("html") ||
						tag.getText().toLowerCase().startsWith("<!doctype")))
				{
					// a new starting tag was found
					// add text to this tag until either a new starting tag
					// is found or a closing tag occurs
					// put the old tag on the stack
					StackValue old = sv;
					sv = new StackValue(tag);
					sv.addValue(-10L);
					if (old != null)
						tagStack.add(old);
				}
				else if (!tag.isOpeningTag() && (tag.getShortTag().equals("div") || tag.getShortTag().equals("td")))
				{
					// closing tag was found, so pop the last open tag and 
					// append further text to this tag
					sv.addText(tag);
					StackValue subVal = sv;
					if (!tagStack.isEmpty()) // should not happen
					{
						sv = tagStack.pop();
						if (sv == subVal)
							sv = tagStack.pop();
						// only add content that is of value
						if (subVal.getValue() > 0L)
						{
							sv.addValue(subVal.getValue());
							sv.addText(subVal.getText());
						}
					}
				}
				else
				{
					sv.addText(tag);
					if (sv != null && (tag.isOpeningTag() || tag.getShortTag().equals("p")))
						sv.addValue(-8L);
					else if (tag.isOpeningTag() && tag.getShortTag().equals("p"))
						sv.addValue(3L);
					else
						sv.addValue(-5L);
				}
			}
			// We found a word - add it to the current stack value object
			else
			{
				Word word = (Word)token;
				if (sv != null)
				{
					sv.addText(word);
					sv.addValue(1L);
				}
			}			
		}
		
		if (sv != null && sv.getValue() > max)
		{
			maxVal = sv;
			max = sv.getValue();
		}
		
		return this.formatText(maxVal.getText());
	}
	
	/**
	 * <p>This algorithm builds a stack for open tags and adds text which lies 
	 * between an opening and a closing tag to the open-tag on top of the stack. 
	 * Tags itself get a penalty-value whereas words (= non-tags) have a value 
	 * of 1.</p>
	 * <p>If a closing-tag is found the last open tag is taken from the stack
	 * and the value and text is added to the open tag.</p>
	 * <p>The tag with the highest value may be expected to contain the actual
	 * article we are interested in</p>
	 **/
	@Override
	public List<String> predictText(List<String> urls) throws ExtractionException
	{
		List<String> predictedContent = new ArrayList<String>();
		for (String url : urls)
			predictedContent.add(this.predictText(url));
		return predictedContent;
	}

	@Override
	public List<Token> cleanText(List<Token> text) 
	{
		return text;
	}
}
