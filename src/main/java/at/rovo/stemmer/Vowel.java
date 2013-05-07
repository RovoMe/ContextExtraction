package at.rovo.stemmer;


/**
 * <p>Represents a vowel. So characters like 'a', 'e', 
 * 'i', 'o' and 'u' are vowels, but also 'y' if it is
 * following a consonant character!<p>
 * 
 * @author Roman Vottner
 */
public class Vowel extends Letter
{
	/**
	 * <p>Initializes a new instance of this class with 
	 * the provided letter as start of this sequence of 
	 * vowels</p>
	 * 
	 * @param letter First vowel of this sequence of
	 *               vowels
	 */
	protected Vowel(char letter) 
	{
		super(letter);
	}
}
