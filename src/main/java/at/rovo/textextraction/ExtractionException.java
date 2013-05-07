package at.rovo.textextraction;

public class ExtractionException extends Exception
{
	private static final long serialVersionUID = -9123143564786801311L;

	public ExtractionException()
	{
		super();
	}
	
	public ExtractionException(String msg)
	{
		super(msg);
	}
	
	public ExtractionException(Throwable t)
	{
		super(t);
	}
	
	public ExtractionException(String msg, Throwable t)
	{
		super(msg, t);
	}
}
