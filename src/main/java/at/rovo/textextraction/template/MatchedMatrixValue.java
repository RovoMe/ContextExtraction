package at.rovo.textextraction.template;

public enum MatchedMatrixValue
{
	NULL(0),
	UP(1),
	LEFT(2),
	UP_LEFT(3);
	
	private int value;
	private MatchedMatrixValue(int value)
	{
		this.value = value;
	}
	
	public int getValue()
	{
		return this.value;
	}
}
