package at.rovo.textextraction.templateIndependent;

/**
 * Created by roman on 19.07.14.
 */
public class Sequence implements Comparable<Double>
{
	private final String sequence;
	private Double score;
	private final int position;

	public Sequence(String sequence, Double score, int pos)
	{
		this.sequence = sequence;
		this.score = score;
		this.position = pos;
	}

	public String getSequence()
	{
		return sequence;
	}

	public Double getScore()
	{
		return this.score;
	}

	public int getPosition()
	{
		return this.position;
	}

	/**
	 * Updates the score with the value obtained by the link penalty score.
	 *
	 * @param lambda The weighting factor for the link penalty score
	 * @param linkPenaltyScore The result of the link penalty score calculation
	 */
	public void updateScore(float lambda, Double linkPenaltyScore)
	{
		this.score += lambda * linkPenaltyScore;
	}

	@Override
	public int compareTo(Double otherScore)
	{
		if (this.score < otherScore)
			return 1;
		else if (this.score > otherScore)
			return -1;
		return 0;
	}

	@Override
	public String toString()
	{
		return "Pos: "+position+", Score: "+score+", Sequence: "+sequence;
	}
}
