package at.rovo.textextraction.templateIndependent;

/**
 * Will hold a the content of a candidate sequence as well as its word count
 */
public class Candidate
{
    private final String sequence;
    private final int count;

    public Candidate(String sequence, int count)
    {
        this.sequence = sequence;
        this.count = count;
    }

    public String getSequence()
    {
        return this.sequence;
    }

    public int getCount()
    {
        return this.count;
    }

    @Override
    public String toString()
    {
        return this.count + ": " + sequence;
    }
}
