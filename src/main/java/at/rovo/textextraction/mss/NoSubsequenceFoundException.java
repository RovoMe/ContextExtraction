package at.rovo.textextraction.mss;

import at.rovo.textextraction.ExtractionException;

public class NoSubsequenceFoundException extends ExtractionException
{
	private static final long serialVersionUID = 2775851708733807917L;

	public NoSubsequenceFoundException()
	{
		super();
	}
	
	public NoSubsequenceFoundException(String msg)
	{
		super(msg);
	}
	
	public NoSubsequenceFoundException(Throwable t)
	{
		super(t);
	}
	
	public NoSubsequenceFoundException(String msg, Throwable t)
	{
		super(msg, t);
	}
}
