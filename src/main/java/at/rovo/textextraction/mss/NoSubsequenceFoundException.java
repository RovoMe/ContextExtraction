package at.rovo.textextraction.mss;

import at.rovo.textextraction.ExtractionException;

/**
 * Indicates that during calculation of the {@link MaximumSubsequenceSegmentation} an error occurred that prevented the
 * algorithm from returning any valid subsequence.
 *
 * @author Roman Vottner
 */
public class NoSubsequenceFoundException extends ExtractionException
{
    /** Required for serialization **/
    private static final long serialVersionUID = 2775851708733807917L;

    /**
     * Creates a new instance which does not contain any specific information regarding the case why the exception was
     * created.
     */
    public NoSubsequenceFoundException()
    {
        super();
    }

    /**
     * Creates a new instances and assigns an error message to indicate the reason why this object was created.
     *
     * @param msg
     *         The error message
     */
    public NoSubsequenceFoundException(String msg)
    {
        super(msg);
    }

    /**
     * Creates a new instance which forwards the error cause to the receiver of the exception.
     *
     * @param t
     *         The exception that caused the creation of this instance
     */
    public NoSubsequenceFoundException(Throwable t)
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
    public NoSubsequenceFoundException(String msg, Throwable t)
    {
        super(msg, t);
    }
}
