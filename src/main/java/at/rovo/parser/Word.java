package at.rovo.parser;

/**
 * <p>Represents a typical CDATA part in HTML or XML. 
 * This means text between two tags, f.e.: in the 
 * following code-snippet 'Example' is the CDATA part
 * of this code: <code>&lt;p>Example&lt;/p></code></p> 
 * 
 * @author Roman Vottner
 */
public class Word extends Token
{
	/**
	 * <p>Initializes a new instance of a CDATA part 
	 * of a HTML code</p>
	 * @param text
	 */
	public Word(String text)
	{
		super(text);
	}
}
