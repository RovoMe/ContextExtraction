package at.rovo.stemmer;


/**
 * <p>Represents any character in the range from a to z
 * in an English alphabet</p>
 * <p>Note that this class is abstract and is implemented
 * by {@link Consonant} and {@link Vowel} class which 
 * correspond to consonants and vowels in the alphabet
 * depicted</p>
 * <p>Sequences of the same type (e.g. consonants) can be
 * added together using the {@link #add(char)} method.</p>
 * 
 * @author Roman Vottner
 */
public abstract class Letter 
{
	protected String letter;
	
	/**
	 * <p>Initializes a new instance of a letter with
	 * the provided character as starting letter</p>
	 * 
	 * @param letter Character this letter should start 
	 *               with
	 */
	protected Letter(char letter)
	{
		this.letter = ""+letter;
	}
	
	/**
	 * <p>Returns all characters of this sequence</p>
	 * 
	 * @return All characters of this sequence
	 */
	public String getLetter()
	{
		return this.letter;
	}
	
	/**
	 * <p>Adds a character to the letter-sequence</p>
	 * @param c
	 */
	public void add(char c) 
	{
		this.letter += c;
	}

}
