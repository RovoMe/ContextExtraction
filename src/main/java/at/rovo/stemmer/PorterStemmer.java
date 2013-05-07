package at.rovo.stemmer;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import at.rovo.parser.Parser;

/**
 * <p>Implementation of Porter's stemming algorithm as presented in his
 * paper 'An algorithm for suffix stripping'</p>
 * 
 * @author Roman Vottner
 */
public final class PorterStemmer 
{
	private static Logger logger = LogManager.getLogger(Parser.class.getName());
	
	/**
	 * <p>Stems a word into a certain principal part or base form</p>
	 * 
	 * @param word The word that should be transformed in a certain 
	 *             principal part
	 * @return The principal part of a certain word
	 */
	public static String stem(final String word)
	{
		// Explanation:
		// *S - the stem ends with S (and similarly for the other letters)
		// *v* - the stem contains a vowel
		// *d - the stem ends with a double consonant (e.g. -TT, -SS)
		// *o - the stem ends cvc, where the second c is not W, X or Y (e.g. -WIL, -HOP)
		
		String txt = word.toLowerCase();
		// remove every character that is either no letter or no number
		txt = txt.replaceAll("[^\\p{L}\\p{N}]", "");
		// replace all numbers with 1
		txt = txt.replaceAll("[0-9]+/*\\.*[0-9]*", "1");
		// Deal with plurals and past participles
		txt = step1(txt);
		// Map double suffices to single ones
		txt = step2(txt);
		// Deals with -full, -ness, ...
		txt = step3(txt);
		// Takes off -ant, -ence etc., in context [c]vcvc[v]
		txt = step4(txt);
		// Removes a final -e if the measure of the stem is > 1.
		txt = step5(txt);

		return txt;
	}
	
	/**
	 * <p>Step 1 of Porter's algorithm.</p>
	 * <p>This step deals with plurals and forming it back to singular. 
	 * Furthermore it turns ending 'y's to 'i' when there is another 
	 * vowel in the stem.</p>
	 * 
	 * @param word The word which should be stemmed
	 * @return The word stemmed to singular form
	 */
	private static String step1(String word)
	{
		if (word.length() < 3)
			return word;
		
		// step 1a
		if (word.endsWith("s"))
		{
			if (word.endsWith("sses")) // SSES --> SS
				word = replace(word,"sses", "ss");
			else if (word.endsWith("ies")) // IES --> I 
				word = replace(word, "ies", "i");
			else if (word.endsWith("ss")) // SS --> SS
				; // do nothing
			else if (word.endsWith("s")) // S --> 
				word = replace(word, "s", "");
		}
		// setp 1b
		if (word.endsWith("eed") && getMeasure(stemWord(word, "eed"))>0) // (m>0) EED --> EE
			word = replace(word, "eed", "ee");
		else if (word.endsWith("ed") && containsVowel(stemWord(word, "ed")))   // (*v*) ED -->
		{
			word = word.substring(0, word.length()-2);
			if (word.endsWith("at")) // AT --> ATE
				word = word+"e";
			else if (word.endsWith("bl")) // BL --> BLE
				word = word+"e";
			else if (word.endsWith("iz")) // IZ --> IZE
				word = word+"e";
			else if (hasDoubleConsonantEnding(word) &&  // (*d and not (*L or *S or *Z) --> single letter
					!(word.endsWith("l") || word.endsWith("s") || word.endsWith("z")))
				word = word.substring(0, word.length()-1);
			else if (PorterStemmer.getMeasure(word)==1 && endsWith_cvc(word)) // (m=1 and *o) --> E
				word = word+"e";
		}
		else if (word.endsWith("ing") && containsVowel(stemWord(word, "ing")))  // (*v*) ING -->
		{                                                                              
			word = word.substring(0, word.length()-3);
			if (word.endsWith("at")) // AT --> ATE
				word = word+"e";
			else if (word.endsWith("bl")) // BL --> BLE
				word = word+"e";
			else if (word.endsWith("iz")) // IZ --> IZE
				word = word+"e";
			else if (hasDoubleConsonantEnding(word) &&  // (*d and not (*L or *S or *Z) --> single letter
					!(word.endsWith("l") || word.endsWith("s") || word.endsWith("z")))
				word = word.substring(0, word.length()-1);
			else if (PorterStemmer.getMeasure(word)==1 && endsWith_cvc(word)) // (m=1 and *o) --> E
				word = word+"e";
		}
		// step 1c
		if (word.endsWith("y") && containsVowel(stemWord(word, "y"))) // (*v*) Y --> I
			word = replace(word, "y", "i");
		
		logger.debug("After step 1: "+word);
		return word;
	}
	
	/**
	 * <p>Step 2 of Porter's algorithm.</p>
	 * <p>Maps double suffices to single ones. So -ization (= -ize plus
	 * -ation) maps to -ize etc. Note that the measure of the string 
	 * before the suffix (= stem) must be > 0.</p> 
	 * <p>Includes later changes of some rules</p>
	 * <ul>
	 * <li>(m > 0) LOGI --> LOG added</li>
	 * <li>(m > 0) ABLI --> ABLE changed to (m > 0) BLI --> BLE</li>
	 * </ul>
	 * @param word The word which should be stemmed
	 * @return The stemmed word
	 **/
	private static String step2(String word)
	{
		// using switch as proposed by Porter in his paper
		if (word.length() < 7)
			return word;
		char penultimate = word.toCharArray()[word.length()-2];
		switch (penultimate)
		{
			case 'a':
				if (word.endsWith("ational") && getMeasure(stemWord(word, "ational"))>0) // (m>0) ATIONAL --> ATE
					word = replace(word, "ational", "ate");
				else if (word.endsWith("tional") && getMeasure(stemWord(word, "tional"))>0) // (m>0) TIONAL --> TION
					word = replace(word, "tional", "tion");
				break;
			case 'c':
				if (word.endsWith("enci") && getMeasure(stemWord(word, "enci"))>0) // (m>0) ENCI --> ENCE
					word = replace(word, "enci", "ence");
				else if (word.endsWith("anci") && getMeasure(stemWord(word, "anci"))>0) // (m>0) ANCI --> ANCE
					word = replace(word, "anci", "ance");
				break;
			case 'e': 
				if (word.endsWith("izer") && getMeasure(stemWord(word, "izer"))>0) // (m>0) IZER --> IZE
					word = replace(word, "izer", "ize");
				break;
			case 'g':
				if (word.endsWith("logi") && getMeasure(stemWord(word, "logi"))>0) // (m>0) LOGI --> LOG
					word = replace(word, "logi", "log");
				break;
			case 'l':
				if (word.endsWith("bli") && getMeasure(stemWord(word, "bli"))>0) // (m>0) ABLI --> ABLE
					word = replace(word, "bli", "ble");
				else if (word.endsWith("alli") && getMeasure(stemWord(word, "alli"))>0) // (m>0) ALLI --> AL
					word = replace(word, "alli", "al");
				else if (word.endsWith("entli") && getMeasure(stemWord(word, "entli"))>0) // (m>0) ENTLI --> ENT
					word = replace(word, "entli", "ent");
				else if (word.endsWith("eli") && getMeasure(stemWord(word, "eli"))>0) // (m>0) ELI --> E
					word = replace(word, "eli", "e");
				else if (word.endsWith("ousli") && getMeasure(stemWord(word, "ousli"))>0) // (m>0) OUSLI --> OUS
					word = replace(word, "ousli", "ous");
				break;
			case 'o':
				if (word.endsWith("ization") && getMeasure(stemWord(word, "ization"))>0) // (m>0) IZATION --> IZE
					word = replace(word, "ization", "ize");
				else if (word.endsWith("ation") && getMeasure(stemWord(word, "ation"))>0) // (m>0) ATION --> ATE
					word = replace(word, "ation", "ate");
				else if (word.endsWith("ator") && getMeasure(stemWord(word, "ator"))>0) // (m>0) ATOR --> ATE
					word = replace(word, "ator", "ate");
				break;
			case 's':
				if (word.endsWith("alism") && getMeasure(stemWord(word, "alism"))>0) // (m>0) ALISM --> ALE
					word = replace(word, "alism", "ale");
				else if (word.endsWith("iveness") && getMeasure(stemWord(word, "iveness"))>0) // (m>0) IVENESS --> IVE
					word = replace(word, "iveness", "ive");
				else if (word.endsWith("fulness") && getMeasure(stemWord(word, "fulness"))>0) // (m>0) FULNESS --> FUL
					word = replace(word, "fulness", "ful");
				else if (word.endsWith("ousness") && getMeasure(stemWord(word, "ousness"))>0) // (m>0) OUSNESS --> OUS
					word = replace(word, "ousness", "ous");
				break;
			case 't':
				if (word.endsWith("aliti") && getMeasure(stemWord(word, "aliti"))>0) // (m>0) ALITI --> AL
					word = replace(word, "aliti", "al");
				else if (word.endsWith("iviti") && getMeasure(stemWord(word, "iviti"))>0) // (m>0) IVITI --> IVE
					word = replace(word, "iviti", "ive");
				else if (word.endsWith("biliti") && getMeasure(stemWord(word, "biliti"))>0) // (m>0) BILITI --> BLE
					word = replace(word, "biliti", "ble");
				break;
			default:
				; // do nothing
		}
	
		logger.debug("After step 2: "+word);
		return word;
	}
	
	/**
	 * <p>Step 3 of Porter's algorithm.</p>
	 * <p>Deals with -ic-, -full, -ness etc. Similar strategy to step 2.</p>
	 * 
	 * @param word The word which should be stemmed
	 * @return The stemmed word
	 */
	private static String step3(String word)
	{
		if (word.length() < 2)
			return word;
		char ultimate = word.toCharArray()[word.length()-1];
		switch (ultimate)
		{
			case 'e':
				if (word.endsWith("icate") && getMeasure(stemWord(word, "icate"))>0) // (m>0) ICATE --> IC
					word = replace(word, "icate", "ic");
				else if (word.endsWith("ative") && getMeasure(stemWord(word, "ative"))>0) // (m>0) ATIVE -->
					word = replace(word, "ative", "");
				else if (word.endsWith("alize") && getMeasure(stemWord(word, "alize"))>0) // (m>0) ALIZE --> AL
					word = replace(word, "alize", "al");
				break;
			case 'i':
				if (word.endsWith("iciti") && getMeasure(stemWord(word, "iciti"))>0) // (m>0) ICITI --> IC
					word = replace(word, "iciti", "ic");
				break;
			case 'l':
				if (word.endsWith("ical") && getMeasure(stemWord(word, "ical"))>0) // (m>0) ICAL --> IC
					word = replace(word, "ical", "ic");
				else if (word.endsWith("ful") && getMeasure(stemWord(word, "ful"))>0) // (m>0) FUL -->
					word = replace(word, "ful", "");
				break;
			case 's':
				if (word.endsWith("ness") && getMeasure(stemWord(word, "ness"))>0) // (m>0) NESS -->
					word = replace(word, "ness", "");
				break;
			default:
				;
		}
		
		logger.debug("After step 3: "+word);
		return word;
	}
	
	/**
	 * <p>Step4 of Porter's algorithm.</p>
	 * <p>Takes off -ant, -ence etc., in context [c]vcvc[V]</p>
	 *  
	 * @param word The word which should be stemmed
	 * @return The stemmed word
	 */
	private static String step4(String word)
	{
		if (word.length() < 3)
			return word;
		char penultimate = word.toCharArray()[word.length()-2];
		switch (penultimate)
		{
			case 'a':
				if (word.endsWith("al") && getMeasure(stemWord(word, "al"))>1) // (m>1) AL -->
					word = replace(word, "al", "");
				break;
			case 'c':
				if (word.endsWith("ance") && getMeasure(stemWord(word, "ance"))>1) // (m>1) ANCE -->
					word = replace(word, "ance", "");
				else if (word.endsWith("ence")) // (m>1) ENCE -->
					word = replace(word, "ence", "");
				break;
			case 'e':
				if (word.endsWith("er") && getMeasure(stemWord(word, "er"))>1) // (m>1) ER -->
					word = replace(word, "er", "");
				break;
			case 'i':
				if (word.endsWith("ic") && getMeasure(stemWord(word, "ic"))>1) // (m>1) IC -->
					word = replace(word, "ic", "");
				break;
			case 'l':
				if (word.endsWith("able") && getMeasure(stemWord(word, "able"))>1) // (m>1) ABLE -->
					word = replace(word, "able", "");
				else if (word.endsWith("ible") && getMeasure(stemWord(word, "ible"))>1) // (m>1) IBLE -->
					word = replace(word, "ible", "");
				break;
			case 'n':
				if (word.endsWith("ant") && getMeasure(stemWord(word, "ant"))>1) // (m>1) ANT -->
					word = replace(word, "ant", "");
				else if (word.endsWith("ement") && getMeasure(stemWord(word, "ement"))>1) // (m>1) EMENT -->
					word = replace(word, "ement", "");
				else if (word.endsWith("ment") && getMeasure(stemWord(word, "ment"))>1) // (m>1) MENT -->
					word = replace(word, "ment", "");
				else if (word.endsWith("ent") && getMeasure(stemWord(word, "ent"))>1) // (m>1) ENT -->
					word = replace(word, "ent", "");
				break;
			case 'o':
				if (word.endsWith("sion") && getMeasure(stemWord(word, "sion"))>1) // (m>1) and *S ION -->
					word = replace(word, "sion", "");
				else if (word.endsWith("tion") && getMeasure(stemWord(word, "tion"))>1) // (m>1) and *T ION -->
					word = replace(word, "tion", "");
				else if (word.endsWith("ou") && getMeasure(stemWord(word, "ou"))>1) // (m>1) OU -->
					word = replace(word, "ou", "");
				break;
			case 's':
				if (word.endsWith("ism") && getMeasure(stemWord(word, "ism"))>1) // (m>1) ISM -->
					word = replace(word, "ism", "");
				break;
			case 't':
				if (word.endsWith("ate") && getMeasure(stemWord(word, "ate"))>1) // (m>1) ATE -->
					word = replace(word, "ate", "");
				else if (word.endsWith("iti") && getMeasure(stemWord(word, "iti"))>1) // (m>1) ITI -->
					word = replace(word, "iti", "");
				break;
			case 'u':
				if (word.endsWith("ous") && getMeasure(stemWord(word, "ous"))>1) // (m>1) OUS -->
					word = replace(word, "ous", "");
				break;
			case 'v':
				if (word.endsWith("ive") && getMeasure(stemWord(word, "ive"))>1) // (m>1) IVE -->
					word = replace(word, "ive", "");
				break;
			case 'z':
				if (word.endsWith("ize") && getMeasure(stemWord(word, "ize"))>1) // (m>1) IZE -->
					word = replace(word, "ize", "");
				break;
			default:
				;
		}
		
		logger.debug("After step 4: "+word);
		return word;
	}
	
	/** 
	 * <p>Step 5 of Porter's algorithm.</p>
	 * <p>Removes a final -e if the measure of the stem is > 1.</p>
	 * 
	 * @param word The word which should be stemmed
	 * @return The stemmed word
	 */
	private static String step5(String word)
	{
		// step 5a
		if (word.endsWith("e") && getMeasure(stemWord(word, "e"))>1) // (m>1) E -->
			word = replace(word, "e", "");
		else if (word.endsWith("e") && !endsWith_cvc(stemWord(word, "e")) && getMeasure(stemWord(word, "e"))==1) // (m=1 and not *o) E -->
			word = replace(word, "e", "");
		// steb 5b
		else if (word.endsWith("l") && hasDoubleConsonantEnding(word) && getMeasure(word)>1) // (m>1 and *d and *L) --> single letter
			word = word.substring(0, word.length()-1);
		
		logger.debug("After step 5: "+word);
		return word;
	}
	

	/**
	 * <p>Returns the stem of a word based on its suffix</p>
	 * 
	 * @param word Word including stem and suffix
	 * @param suffix Suffix which should get removed
	 * @return The stem of the word
	 */
	private static String stemWord(String word, String suffix)
	{
		return word.substring(0, word.length()-suffix.length());
	}
	
	/**
	 * <p>Replaces the old ending of a word with a new ending</p>
	 * 
	 * @param word Word which ending should be modified
	 * @param oldEnd The old ending that should be replaced
	 * @param newEnd The new ending of the word
	 * @return The new word after the replacement 
	 * @throws IllegalArgumentException if the old ending is larger then the word itself
	 * @throws IllegalArgumentException if the old ending could not be found inside the word itself
	 */
	private static String replace(final String word, final String oldEnd, final String newEnd)
	{
		if (word.length() < oldEnd.length())
			throw new IllegalArgumentException("Old ending of the word cannot be larger then the word itself!");
		if (word.indexOf(oldEnd) == -1)
			throw new IllegalArgumentException("'"+oldEnd+"' could not be found inside of '"+word+"'");
		return word.substring(0, word.length()-oldEnd.length())+newEnd;
	}
	
	/**
	 * <p>Checks if a word stem contains a vowel</p>
	 * 
	 * @param word Stem of a word that should be examined 
	 *             for occurrence of at least one vowel
	 * @return true if the word contains a vowel; 
	 *         false otherwise
	 */
	private static boolean containsVowel(final String stem)
	{
		List<Letter> letters = PorterStemmer.getLetters(stem);
		for (Letter letter : letters)
			if (letter instanceof Vowel)
				return true;
		return false;
	}
	
	/**
	 * <p>Decides if a word ends on the same two consonant letters - 
	 * not vowels!</p>
	 * 
	 * @param word The word which last two letters should be examined 
	 *             for equality and for being consonants
	 * @return true if the word ends on the same two consonant letters;
	 *         false if either the two characters are different or the 
	 *         characters are vowels
	 */
	private static boolean hasDoubleConsonantEnding(final String word)
	{
		char[] txt = word.toLowerCase().toCharArray();
		int length = txt.length;
		if (length < 3)
			return false;
		// compare equality of last two chars
		if (txt[length-2] != txt[length-1])
			return false;
		// check if the last two chars (which are equal) 
		// are vowels
		// Note: as a Y following a consonant turns into a vowel
		// double Ys aren't possible as double consonants!
		if (txt[length-1] == 'a' || txt[length-1] == 'e' || 
				txt[length-1] == 'i' || txt[length-1] == 'o' || 
				txt[length-1] == 'u' || txt[length-1] == 'y')
			return false;
		return true;
	}
	
	/**
	 * <p>Decides if the last three characters of a word are
	 * of the form consonant-vowel-consonant and the last 
	 * consonant is neither 'W', 'X' nor 'Y'</p>
	 * 
	 * @param word The word which last tree letters should be 
	 *             examined
	 * @return true if the word ends with a sequence of 
	 *         consonant-vowel-consonant; false otherwise
	 */
	private static boolean endsWith_cvc(final String word)
	{
		char[] c = word.toLowerCase().toCharArray();
		if (c.length >= 4)
		{
			if (isConsonant(c[c.length-3], c[c.length-4]) && // c
					!isConsonant(c[c.length-2], c[c.length-3]) && // v 
					isConsonant(c[c.length-1], c[c.length-2]) &&  // c
					(c[c.length-1] != 'w' || c[c.length-1] != 'x' || 
					c[c.length-1] != 'y'))
				return true;
		}
		else if (c.length == 3)
		{
			if (isConsonant(c[0]) && // c
					!isConsonant(c[1], c[0]) && // v 
					isConsonant(c[2], c[1]) &&  // c
					(c[2] != 'w' || c[2] != 'x' || c[2] != 'y'))
				return true;
		}
		return false;
	}
	
	/**
	 * <p>Decides if a char is a consonant or a vowel</p>
	 * <p>This function is intended for characters at the start
	 * of a word as no preceding character is available, so only
	 * 'a', 'e', 'i', 'o' and 'u' are considered to be vowels</p>
	 * <p>If 'y' should be considered a vowel too, please use 
	 * {@link #isConsonant(char, char)} instead</p>
	 * 
	 * @param c Character to decide if it is a consonant or a vowel
	 * @return true if the character is a consonant, 
	 *         false if it is a vowel
	 */
	private static boolean isConsonant(final char c)
	{
		if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
			return false;
		return true;
	}
	
	/**
	 * <p>Decides if a char is a consonant or vowel</p>
	 * <p>The previous char is necessary as 'Y' characters turn
	 * into a vowel if a preceding character is a consonant!</p>
	 * <p>Use {@link #isConsonant(char)} if 'y' should always 
	 * considered to a consonant</p>
	 * 
	 * @param c Character to decide if it is a consonant or a vowel
	 * @param prevChar Preceding character of c
	 * @return true if the character is a consonant, 
	 *         false if it is a vowel
	 */
	private static boolean isConsonant(final char c, final char prevChar)
	{
		if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
			return false;
		if (c == 'y' && isConsonant(prevChar))
			return false;
		return true;
	}
	
	/**
	 * <p>Converts a word into a {@link List} of {@link Letter}s 
	 * in exact {@link Vowel}s and {@link Consonant}s</p>
	 * <p>Each {@link Letter} object will contain either a 
	 * sequence of vowels or consonant but never both of them!</p>
	 * <p>The {@link List} itself contains the {@link Letter} 
	 * objects in an unsorted order which keeps the structure
	 * of the origin word as it is.</p>
	 * 
	 * @param word The word which should get converted
	 * @return A {@link List} of {@link Letter}s containing 
	 *         sequences of {@link Vowel}s and {@link Consonant}s
	 */
	private static List<Letter> getLetters(final String word)
	{
		char[] txt = word.toLowerCase().toCharArray();
		List<Letter> letters = new ArrayList<Letter>();
		Letter lastLetter = null;
		for (int i=0; i<txt.length; i++)
		{
			char c = txt[i];
			// A, E, I, O, U are vowels by nature
			if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
			{
				if (lastLetter != null && lastLetter instanceof Vowel)
					lastLetter.add(c);
				else
				{
					lastLetter = new Vowel(c);
					letters.add(lastLetter);
				}
			}
			// Y is only a vowel if there is a preceding consonant!
			else if (i>0 && c == 'y' && lastLetter instanceof Consonant)
			{
				lastLetter = new Vowel(c);
				letters.add(lastLetter);
			}
			// We have a consonant here
			else 
			{
				// if this is the first character or a consonant after a vowel
				if (lastLetter == null || (lastLetter != null && lastLetter instanceof Vowel))
				{
					lastLetter = new Consonant(c);
					letters.add(lastLetter);
				}
				else
					lastLetter.add(c);
			}
		}
		return letters;
	}
	
	/**
	 * <p>Calculates the measure of a word according to Porter's 
	 * definition in his paper 'An algorithm for suffix stripping"</p>
	 * <p>It therefore divides {@link Letter}s into {@link Vowel}s and 
	 * {@link Consonant}s which he uses to calculate the measure for
	 * a word</p>
	 * <ul>
	 * <li>Vowel v: A, E, I, O, U, Y when preceding char is a consonant</li>
	 * <li>Consonant c: Everything except v</li>
	 * </ul>
	 * <p>Further a series of consonants and vowels can be shortened as 
	 * <code>ccc...vvv...ccc...vvv --> CVCV</code></p>
	 * <p>The calculation of the measure can now be expressed as 
	 * <code>[C](VC)^m[V]</code> where m is the measure of a word with the 
	 * letters in the square brackets being optional elements </p>
	 * <ul>Examples:
	 * <li>m=0: TR, EE, TREE, Y, BY</li>
	 * <li>m=1: TROUBLES, OATS, TREES, IVY</li>
	 * <li>m=2: TROUBLES, PRIVATE, OATEN, ORRERY</li>
	 * </ul>
	 * @param stem The stem of the word which measure should be calculated
	 * @return The measure of a word
	 */
	private static int getMeasure(final String stem)
	{		
		List<Letter> letters = PorterStemmer.getLetters(stem);
		
		int m = 0;
		int start = 0;
		int length = letters.size();
		if (length == 0)
			return 0;
		// if the last element is a vowel, skip it
		if (letters.get(length-1) instanceof Vowel)
			length -= 1;
		// Skip leeding consonant
		if (letters.get(0) instanceof Consonant)
		{
			start = 1;
			length -= 1;
		}
		for (int i=start; i<start+length; i++)
			if (letters.get(i) instanceof Consonant)
				m++;
		return m;
	}
}
