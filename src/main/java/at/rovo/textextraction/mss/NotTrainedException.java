package at.rovo.textextraction.mss;

import at.rovo.textextraction.ExtractionException;

public class NotTrainedException extends ExtractionException
{
	private static final long serialVersionUID = 1387928683153556148L;

	public NotTrainedException()
	{
		super();
	}
	
	public NotTrainedException(String msg)
	{
		super(msg);
	}
	
	public NotTrainedException(Throwable t)
	{
		super(t);
	}
	
	public NotTrainedException(String msg, Throwable t)
	{
		super(msg, t);
	}
}
