package at.rovo.parser;

/**
 * <p>This class represents an abstraction of an HTML code.
 * A token is either a {@link Tag} or a {@link Word} and 
 * provides basic methods for both subclasses.</p>
 * 
 * @see Tag
 * @see Word
 * @author Roman Vottner
 */
public abstract class Token 
{
	protected String text = "";
	private int index = 0;
	
	/**
	 * <p>Initializes objects of subclasses and 
	 * sets the text of this token.</p>
	 * 
	 * @param text Text of this token
	 */
	public Token(String text)
	{
		this.text = text;
	}
	
	/**
	 * <p>Returns the text of this token instance</p>
	 * 
	 * @return The text assigned to this token
	 */
	public String getText() { return this.text; }
	
	/**
	 * <p>Returns the index of the token</p>
	 * 
	 * @return Current index of the token
	 */
	public int getIndex() { return this.index; }
	
	/**
	 * <p>Sets the index of the token to the specified value</p>
	 * 
	 * @param index The new index of the token
	 */
	public void setIndex(int index) { this.index = index; }
	
	@Override
	public String toString() { return this.text; }
}
