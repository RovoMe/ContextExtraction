package at.rovo.textextraction.template;

/**
 * Defines the directions to look for similar nodes in the tree.
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
     * Assigns a numerical value to an entity
     *
     * @param value
     *         The numerical value of the entity
     */
    MatchedMatrixValue(int value)
    {
        this.value = value;
    }

    /**
     * Returns the numerical value attached to the specified entity.
     *
     * @return The numerical value of the entity
     */
    public int getValue()
    {
        return this.value;
    }
}
