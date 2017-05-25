package at.rovo.textextraction.templateIndependent;

import java.util.Comparator;

/**
 * This comparator compares two sequences based on their position in the original document and ranks sequences with
 * lower position numbers before sequences with higher position numbers.
 */
public class PositionComparator implements Comparator<Sequence>
{
    @Override
    public int compare(Sequence o1, Sequence o2)
    {
        if (o1.getPosition() > o2.getPosition())
        {
            return 1;
        }
        else if (o1.getPosition() < o2.getPosition())
        {
            return -1;
        }
        return 0;
    }
}
