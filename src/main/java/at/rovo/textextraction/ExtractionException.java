package at.rovo.textextraction;

/**
 * Indicates that during the extraction of the main contend from a defined web page an error occurred.
 *
 * @author Roman Vottner
 */
public class ExtractionException extends Exception
{
    /** Required for serialization **/
    private static final long serialVersionUID = -9123143564786801311L;

    /**
     * Creates a new instance which does not contain any specific information regarding the case why the exception was
     * created.
     */
    public ExtractionException()
    {
        super();
    }

    /**
     * Creates a new instances and assigns an error message to indicate the reason why this object was created.
     *
     * @param msg
     *         The error message
     */
    public ExtractionException(String msg)
    {
        super(msg);
    }

    /**
     * Creates a new instance which forwards the error cause to the receiver of the exception.
     *
     * @param t
     *         The exception that caused the creation of this instance
     */
    public ExtractionException(Throwable t)
    {
        super(t);
    }

    /**
     * Creates a new instance and assigns an error message to indicate the reason why this object was created and
     * forwards the error cause which triggered the creation of this instance to the caller.
     *
     * @param msg
     *         The error message
     * @param t
     *         The exception that caused the creation of this instance
     */
    public ExtractionException(String msg, Throwable t)
    {
        super(msg, t);
    }
}
