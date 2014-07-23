package at.rovo.textextraction.templateIndependent;

import java.util.Comparator;

/**
 * This comparator compares two sequences based on their score and ranks
 * sequences with higher scores before sequences with lower scores.
 */
public class ScoreComparator implements Comparator<Sequence>
{
	@Override
	public int compare(Sequence o1, Sequence o2)
	{
		if (o1.getScore() > o2.getScore())
			return -1;
		else if (o1.getScore() < o2.getScore())
			return 1;
		return 0;
	}
}
