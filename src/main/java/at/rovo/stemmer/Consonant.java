package at.rovo.stemmer;


/**
 * <p>Represents a consonant character so every character
 * except 'a', 'e', 'i', 'o' and 'u' as well as 'y' if it 
 * is preceding a consonant character</p>
 * 
 * @author Roman Vottner
 */
public class Consonant extends Letter
{
	/**
	 * <p>Initializes a new instance of this class with 
	 * the provided letter as start of this sequence of 
	 * consonants</p>
	 * 
	 * @param letter First consonant of this sequence of
	 *               consonants
	 */
	protected Consonant(char letter) 
	{
		super(letter);
	}
}
