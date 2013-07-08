package at.rovo.textextraction.mss;

import at.rovo.textextraction.ExtractionException;

/**
 * <p>Indicates that no training data is available which is needed by the 
 * application.</p>
 * 
 * @author Roman Vottner
 */
public class NotTrainedException extends ExtractionException
{
	/** Required for serialization **/
	private static final long serialVersionUID = 1387928683153556148L;

	/**
	 * <p>
	 * Creates a new instance which does not contain any specific information
	 * regarding the case why the exception was created.
	 * </p>
	 */
	public NotTrainedException()
	{
		super();
	}
	
	/**
	 * <p>
	 * Creates a new instances and assigns an error message to indicate the 
	 * reason why this object was created.
	 * </p>
	 * 
	 * @param msg The error message
	 */
	public NotTrainedException(String msg)
	{
		super(msg);
	}
	
	/**
	 * <p>
	 * Creates a new instance which forwards the error cause to the receiver of
	 * the exception. 
	 * </p>
	 * 
	 * @param t The exception that caused the creation of this instance
	 */
	public NotTrainedException(Throwable t)
	{
		super(t);
	}
	
	/**
	 * <p>
	 * Creates a new instance and assigns an error message to indicate the 
	 * reason why this object was created and forwards the error cause which
	 * triggered the creation of this instance to the caller.
	 * </p>
	 * 
	 * @param msg The error message
	 * @param t The exception that caused the creation of this instance
	 */
	public NotTrainedException(String msg, Throwable t)
	{
		super(msg, t);
	}
}
