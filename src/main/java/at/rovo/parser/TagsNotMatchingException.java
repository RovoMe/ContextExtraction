package at.rovo.parser;

public class TagsNotMatchingException extends Exception 
{
	private static final long serialVersionUID = 1L;

	public TagsNotMatchingException()
	{
		super();
	}
	
	public TagsNotMatchingException(String error)
	{
		super(error);
	}
}
