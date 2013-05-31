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
	
	public Word(int id, String name, int parent, int numSiblings, int level)
	{
		super(id, name, name, level, parent, numSiblings);
	}
	
	public Word(Token node)
	{
		super(node);
		
		if (node != null)
		{
			// deep copy
			if (node.matchedNode != null)
			{
				if (node.matchedNode instanceof Word)
					this.matchedNode = new Word((Word)node.matchedNode);
				else
					this.matchedNode = new Tag((Tag)node.matchedNode);
			}
		}
	}
	
	public Word(Word node)
	{
		super(node);
		if (node != null)
		{
			// deep copy
			if (node.matchedNode != null)
				this.matchedNode = new Word((Word)node.matchedNode);
		}
	}
	
	@Override
	public int hashCode()
	{
		int result = 17;
		result = 31 * result + this.text.hashCode();
		return result;
	}
	
	@Override
	public boolean equals(Object obj)
	{
		Word word;
		if (obj instanceof Word)
		{
			word = (Word) obj;
		} 
		else 
		{
			return false;
		}

		if (!(this.text.equalsIgnoreCase(word.text)))
		{
			return false;
		}

		return true;
	}
}
