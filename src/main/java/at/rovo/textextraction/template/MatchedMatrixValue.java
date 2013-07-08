package at.rovo.textextraction.template;

/**
 * <p>
 * Defines the directions to look for similar nodes in the tree.
 * </p>
 * 
 * @author Roman Vottner
 */
public enum MatchedMatrixValue
{
	NULL(0),
	UP(1),
	LEFT(2),
	UP_LEFT(3);
	
	/** The numerical value of the entity **/
	private int value;

	/**
	 * <p>
	 * Assigns a numerical value to an entity
	 * </p>
	 * 
	 * @param value
	 *            The numerical value of the entity
	 */
	private MatchedMatrixValue(int value)
	{
		this.value = value;
	}
	
	/**
	 * <p>
	 * Returns the numerical value attached to the specified entity.
	 * </p>
	 * 
	 * @return The numerical value of the entity
	 */
	public int getValue()
	{
		return this.value;
	}
}
