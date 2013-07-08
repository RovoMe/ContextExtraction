package at.rovo.textextraction;

/**
 * <p>
 * Indicates that during the extraction of the main contend from a defined
 * web page an error occurred.
 * </p>
 * 
 * @author Roman Vottner
 */
public class ExtractionException extends Exception
{
	/** Required for serialization **/
	private static final long serialVersionUID = -9123143564786801311L;

	/**
	 * <p>
	 * Creates a new instance which does not contain any specific information
	 * regarding the case why the exception was created.
	 * </p>
	 */
	public ExtractionException()
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
	public ExtractionException(String msg)
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
	public ExtractionException(Throwable t)
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
	public ExtractionException(String msg, Throwable t)
	{
		super(msg, t);
	}
}
