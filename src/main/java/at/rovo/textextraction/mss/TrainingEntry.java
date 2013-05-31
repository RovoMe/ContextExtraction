package at.rovo.textextraction.mss;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Dictionary;
import java.util.List;
import java.util.Stack;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import at.rovo.classifier.Classifier;
import at.rovo.parser.Parser;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.stemmer.PorterStemmer;

/**
 * <p>Represents a training entry for the maximum subsequence segmentation algorithm.</p>
 * 
 * @author Roman Vottner
 * @version %I%, %G%
 */
public class TrainingEntry 
{
	private static Logger logger = LogManager.getLogger(TrainingEntry.class.getName());
	/**
	 * Web address (URL) of this entry
	 */
	private String url = "";
	/**
	 * The source domain of this entry (first part of the URL)
	 */
	private String source = "";
	/**
	 * HTML code of the page
	 */
	private String html = "";
	/**
	 * Training text
	 */
	private String text = "";
	/**
	 * Category of this entry
	 */
	private String category = "";
	/**
	 * Classifier of this entry
	 */
	private Classifier<String, String> classifier = null;
	/**
	 * List of common tags
	 */
	private Dictionary<String, List<String>> commonTags = null;
	/**
	 * Specifies if this entry was used for training or 
	 * still needs to be trained
	 */
	private boolean trained = false;
	/**
	 * List of tokens representing the HTML page
	 */
	private List<Token> tokens = null;
	/**
	 * The text as tokens
	 */
	private List<Token> tokenText = null;
	/**
	 * Specifies if the most recent unclosed tag stack should be
	 * used as a feature for the classifier training
	 */
	private boolean useMostRecentUnclosedTagFeature = true;
	/**
	 * The used training strategy
	 */
	private TrainingStrategy trainingStrategy = TrainingStrategy.TRIPLE_UNIGRAM;
	
	private Parser parser = null;
	
	/**
	 * <p>Creates a new default instance of this class</p>
	 */
	public TrainingEntry()
	{
		this.parser = new Parser();
		this.parser.cleanFully(true);
	}
	
	/**
	 * <p>Creates a new instance of this class and initializes 
	 * important attributes</p>
	 * 
	 * @param url URL of this entry
	 * @param text Text which should be used for training
	 * @param category Category of the article this entry is representing
	 */
	public TrainingEntry(String url, String text, String category)
	{
		this();
		
		this.url = url;
		this.text = text;
		this.category = category;
	}
	
	/**
	 * <p>Creates a new instance of this class and initializes 
	 * important attributes</p>
	 * 
	 * @param url URL of this entry
	 * @param text Text which should be used for training
	 * @param category Category of the article this entry is representing
	 * @param classifier Classifier which should be trained
	 */
	public TrainingEntry(String url, String text, String category, Classifier<String, String> classifier)
	{
		this();
		
		this.url = url;
		this.text = text;
		this.category = category;
		this.classifier = classifier;
	}
	
	/**
	 * <p>Creates a new instance of this class and initializes 
	 * important attributes</p>
	 * 
	 * @param html The origin page as a {@link List} of {@link Token}s
	 * @param text The actual content to train the classifier as a 
	 *             {@link List} of {@link Token}s
	 * @param classifier Classifier which should be trained
	 */
	public TrainingEntry(List<Token> html, List<Token> text, Classifier<String, String> classifier, boolean useMostRecentUnclosedTagFeature)
	{
		this();
		
		this.tokens = html;
		this.tokenText = text;
		this.classifier = classifier;
		this.useMostRecentUnclosedTagFeature = useMostRecentUnclosedTagFeature;
	}
	
	/**
	 * <p>Returns the URL of this entry as a {@link String} object</p>
	 * 
	 * @return The specified URL of this entry
	 */
	public String getUrl() { return this.url; }
	
	/**
	 * <p>Returns the first part of the URL, f.e. www.java.com</p>
	 * 
	 * @return The specified source URL of this entry
	 */
	public String getSourceUrl() { return this.source; }
	
	/**
	 * <p>Returns the text this entry uses for training</p>
	 * 
	 * @return The specified training text of this entry
	 */
	public String getText() { return this.text; }
	
	/**
	 * <p>Returns the category this entry was labeled with
	 * for further training</p>
	 * 
	 * @return The specified category of this entry.
	 */
	public String getCategory() { return this.category; }
	
	/**
	 * <p>Returns the specified {@link Classifier}</p>
	 * 
	 * @return The specified {@link Classifier}, null if none
	 *         has been specified
	 */
	public Classifier<String, String> getClassifier() { return this.classifier; }
	
	/**
	 * <p>Returns the list of common tags</p>
	 * 
	 * @return The list of common tags
	 */
	public Dictionary<String, List<String>> getCommonTags() { return this.commonTags; }
	
	/**
	 * <p>Specifies if this entry has already been used for training
	 * or not</p>
	 * 
	 * @return true if this entry has already been used for training,
	 *         false otherwise
	 */
	public boolean isTrained() { return this.trained; }
	
	/**
	 * <p>Returns the tokens of the trained document. If the entry 
	 * has not been trained yet null will be returned.</p>
	 * 
	 * @return The tokens of the trained document. If the entry 
	 *         has not been trained yet null will be returned.
	 */
	public List<Token> getTokens() 
	{
		if (this.isTrained())
			return this.tokens;
		return null;
	}
	
	/**
	 * <p>Sets the strategy for training tokens to the local classifier. 
	 * {@link TrainingStrategy#TRIGRAM} will train a trigram, f.e. 
	 * 'token1 token2 token3' while {@link TrainingStrategy#TRIPPLE_UNIGRAM}
	 * will train 'token1', 'token2', 'token3' with the classifier.</p>
	 * <p>By default the system will use {@link TrainingStrategy#TRIPPLE_UNIGRAM}</p>
	 * 
	 * @param strategy The strategy to be used for training
	 */
	public void setTrainingStrategy(TrainingStrategy strategy) { this.trainingStrategy = strategy; }
	
	/**
	 * <p>Returns the currently set training strategy. By default
	 * {@link TrainingStrategy#TRIPPLE_UNIGRAM} will be taken</p>
	 * 
	 * @return The currently used strategy for training new samples
	 */
	public TrainingStrategy getTrainingStrategy() {	return this.trainingStrategy; }
	
	/**
	 * <p>Sets the URL of the article this entry is relating to</p>
	 * 
	 * @param url URL of the article
	 */
	public void setUrl(String url) { this.url = url; }
	
	/**
	 * <p>Sets the source URL of the article this entry is relating to</p>
	 * 
	 * @param source The source URL of the article, f.e. www.java.com
	 */
	public void setSourceUrl(String source) { this.source = source; }
	
	/**
	 * <p>Sets the full HTML code of the article</p>
	 * 
	 * @param html The HTML code of the article
	 */
	public void setHTML(String html) { this.html = html; }
	
	/**
	 * <p>Sets the text which should be used to train the {@link Classifier} 
	 * to distinguish if a {@link Token} is considered to be "in" the article 
	 * or "out".</p>
	 * <p>This method will call {@link Parser#formatText(String)} to format
	 * the text. If the text should be used as is use {@link #setFormatedText(String)}
	 * instead.</p>
	 * 
	 * @param text Text that should be used for training the {@link Classifier}
	 */
	public void setText(String text) { this.text = Parser.formatText(text); }
	
	/**
	 * <p>Sets the text which should be used to train the {@link Classifier} 
	 * to distinguish if a {@link Token} is considered to be "in" the article 
	 * or "out".</p>
	 * <p>This method sets the text as provided without any reformatting.</p>
	 * 
	 * @param text Text that should be used for training the {@link Classifier}
	 */
	public void setFormatedText(String text) { this.text = text; }
	
	/**
	 * <p>Sets the category the article is considered to be.</p>
	 * 
	 * @param category Category of the article
	 */
	public void setCategory(String category) { this.category = category; }
	
	/**
	 * <p>Sets the {@link Classifier} that should be used for training</p>
	 * 
	 * @param classifier {@link Classifier} 
	 */
	public void setClassifier(Classifier<String, String> classifier) { this.classifier = classifier; }
	
	/**
	 * <p>Sets the list of common tags including their sources</p>
	 * 
	 * @param commonTags The list including the common tags and their sources
	 */
	public void setCommonTags(Dictionary<String, List<String>> commonTags) { this.commonTags = commonTags; }
	
	/**
	 * <p>Trains this entry using the specified {@link Classifier} and the
	 * training text which marks the actual content of the article this 
	 * instance is representing.</p>
	 * <p>It first tries to fetch the data from the web in case a URL was 
	 * specified and no HTML text was set else the HTML text is taken and
	 * split up into {@link Token}s.</p>
	 * 
	 * @param fixErrors Indicate if the algorithm should try to fix HTML 
	 *                  errors like unclosed tags (&lt;div>&lt;p>...&lt;/div>)
	 *                  or misspelled tags like &lt/br>.<p>Note however that
	 *                  this is experimental and might not work as expected!</p>
	 * @throws IllegalArgumentException If no {@link Classifier} or no text 
	 *                                  to train the {@link Classifier} was 
	 *                                  specified  
	 */
	public void train(final boolean fixErrors) throws IllegalArgumentException
	{
		if (logger.isTraceEnabled())
			logger.trace("Starting training");
		// build token sequence if there doesn't exist any yet
		if (this.tokens == null)
		{				
			if (this.html.equals(""))
				this.tokens = this.parser.tokenizeURL(this.url, true).getParsedTokens();
			else
				this.tokens = this.parser.tokenize(this.html, true).getParsedTokens();
		}
		if (logger.isDebugEnabled())
			logger.debug("Tokens: "+this.tokens);
		
		if (this.classifier == null)
		{
			if (logger.isErrorEnabled())
				logger.error("No classifier to train was specified!");
			throw new IllegalArgumentException("No classifier to train was specified!");
		}
		
		if (this.tokenText == null && (this.text == null || this.text.length() < 3))
		{
			if (logger.isErrorEnabled())
				logger.error("Training text is to short");
			throw new IllegalArgumentException("Training text is to short");
		}
		
		// build tri-/bi- or unigrams depending on the selected strategy
		List<String> nGrams = null;
		if (this.tokenText != null && this.tokenText.size() > 0)
			nGrams = this.buildNgrams(this.tokenText);
		else
			nGrams = this.buildNgrams(this.text);
		if (logger.isDebugEnabled())
			logger.debug("Trigrams: "+nGrams);
		
		if (logger.isInfoEnabled())
			logger.info("Start training on "+url);
		int end = 0;
		if (TrainingStrategy.BIGRAM.equals(this.trainingStrategy))
			end = 1;
		else if (TrainingStrategy.TRIGRAM.equals(this.trainingStrategy))
			end = 2;
		
		Stack<String> mostRecentUnclosedTag = null;
		if (this.useMostRecentUnclosedTagFeature == true)
			mostRecentUnclosedTag = new Stack<String>();
		
		Token token1 = null;
		Token token2 = null;
		for (int i=0; i<this.tokens.size()-end; i++)
		{
			Token token = this.tokens.get(i);
			
			if (i >= 2 && logger.isDebugEnabled())
			{
				if (TrainingStrategy.TRIGRAM.equals(this.trainingStrategy))
					logger.debug("examin: '"+token1.getText()+"' '"+token2.getText()+"' '"+token.getText()+"'");
				else if (TrainingStrategy.BIGRAM.equals(this.trainingStrategy))
					logger.debug("examin: '"+token2.getText()+"' '"+token.getText()+"'");
			}
			
			if (this.useMostRecentUnclosedTagFeature == true)
			{
				if (fixErrors)
					this.buildMostRecentUnclosedTagStack_FixErrors(token1, token2, token, mostRecentUnclosedTag, nGrams);
				else
					this.buildMostRecentUnclosedTagStack(token, mostRecentUnclosedTag, nGrams);
				
				if (i >= 2)
					this.train(token1, token2, token, mostRecentUnclosedTag, nGrams);
			}
			else
				if (i >= 2)
					this.train(token1, token2, token, nGrams);
			
			token1 = token2;
			token2 = token;
		}
		// training is done - tokens aren't needed anymore
		token1 = null;
		token2 = null;
		
		if (logger.isTraceEnabled())
			logger.trace("Training done");
		this.trained = true;
	}
	
	/**
	 * <p>Adds a {@link Tag} to the list of common tags</p>
	 * 
	 * @param commonTags The list of common tags
	 * @param tag The {@link Tag} to include in the list.
	 */
	private void addTagToCommonTags(Dictionary<String, List<String>> commonTags, Tag tag)
	{
		if (this.source == null || this.source.equals(""))
			throw new IllegalArgumentException("No source was defined for this entry!");
		
		if (tag.getShortTag().trim().equals(""))
			return;
		List<String> sources = commonTags.get(tag.getShortTag().toLowerCase());
		if (sources == null)
		{
			sources = new ArrayList<String>();
			sources.add(this.source);
			commonTags.put(tag.getShortTag().toLowerCase(), sources);
			if (logger.isDebugEnabled())
				logger.debug("New tag found: '"+tag.getShortTag().toLowerCase()+"', source: "+this.source);
		}
		else
		{
			if (!sources.contains(this.source))
			{
				sources.add(this.source);
				if (logger.isDebugEnabled())
					logger.debug("Tag found: '"+tag.getShortTag().toLowerCase()+"', new source: "+this.source);
			}
		}
	}
	
	/**
	 * <p>Builds an n-gram list from a provided text. It therefore
	 * splits the text on blank symbols into a list of {@link Tokens} 
	 * and takes up to three consecutive tokens to form a n-gram.</p>
	 * 
	 * @param text The text which should be split up into a n-grams
	 * @return Returns a list of n-grams extracted from the 
	 *         provided text
	 * @throws IllegalArgumentException if the provided text does
	 *                                  not contain enough tokens
	 *                                  to build a n-gram
	 */
	private List<String> buildNgrams(final String text)
	{
		// The text might have to be formated as <p>Text does not 
		// get split up correctly
		return this.buildNgrams(parser.tokenize(text, true).getParsedTokens());
	}
	
	/**
	 * <p>Builds an n-gram list from a provided text. It therefore
	 * splits the text on blank symbols into a list of {@link Tokens} 
	 * and takes up to three consecutive tokens to form an n-gram.</p>
	 * 
	 * @param tokens The tokens which should be split up into an n-grams
	 * @return Returns a list of n-grams extracted from the 
	 *         provided text
	 * @throws IllegalArgumentException if the provided text does
	 *                                  not contain enough tokens
	 *                                  to build a n-gram
	 */
	private List<String> buildNgrams(final List<Token> tokens)
	{
		List<String> nGrams = new ArrayList<String>();
		
		int start = 0;
		if (TrainingStrategy.BIGRAM.equals(this.trainingStrategy))
			start = 1;
		else if (TrainingStrategy.TRIGRAM.equals(this.trainingStrategy))
			start = 2;
		
		if (tokens.size() < start+1)
			throw new IllegalArgumentException("The provided text does not contain enough tokens to build a "+this.trainingStrategy.name()+"!");
		
		for (int i = start; i<tokens.size(); i++)
		{
			if (TrainingStrategy.TRIGRAM.equals(this.trainingStrategy))
			{
				String t1 = tokens.get(i-2).getText();
				if (tokens.get(i-2) instanceof Word)
					t1 = PorterStemmer.stem(t1);
				String t2 = tokens.get(i-1).getText();
				if (tokens.get(i-1) instanceof Word)
					t2 = PorterStemmer.stem(t2);
				String t3 = tokens.get(i).getText();
				if (tokens.get(i) instanceof Word)
					t3 = PorterStemmer.stem(t3);
				
				if (logger.isDebugEnabled())
					logger.debug("trigram: "+t1+" "+t2+" "+t3);
				
				nGrams.add(t1+" "+t2+" "+t3);
			}
			else if (TrainingStrategy.BIGRAM.equals(this.trainingStrategy))
			{
				String t2 = tokens.get(i-1).getText();
				if (tokens.get(i-1) instanceof Word)
					t2 = PorterStemmer.stem(t2);
				String t3 = tokens.get(i).getText();
				if (tokens.get(i) instanceof Word)
					t3 = PorterStemmer.stem(t3);
				
				if (logger.isDebugEnabled())
					logger.debug("bigram: "+t2+" "+t3);
				nGrams.add(t2+" "+t3);
			}
			else
			{
				String t3 = tokens.get(i).getText();
				if (tokens.get(i) instanceof Word)
					t3 = PorterStemmer.stem(t3);
				
				if (logger.isDebugEnabled())
					logger.debug("unigram: "+t3);
				nGrams.add(t3);
			}
		}
		return nGrams;
	}
	
	/**
	 * <p>Uses a simple heuristic to train the {@link Classifier}.</p>
	 * <p>When a new opening tag is encountered, it is added to the stack.
	 * When  a closing tag is found, the stack unwinds until a corresponding 
	 * opening tag is matched and removed.</p>
	 * 
	 * @param token1 Trigram part one
	 * @param token2 Trigram part two
	 * @param token3 Trigram part three
	 * @param mostRecentUnclosedTag {@link Stack} containing the currently open {@link Tag}s 
	 *                              with the {@link tag} added as last element is on the top 
	 *                              of the stack
	 * @param trigrams {@link List} of Trigrams taken from the training 
	 *                 text. These trigrams are being considered to be
	 *                 in the article
	 */
	private void buildMostRecentUnclosedTagStack(Token token, Stack<String> mostRecentUnclosedTag, List<String> trigrams)
	{
		if (token instanceof Tag)
		{
			Tag tag = (Tag)token;
			
			if (tag.isOpeningTag())
			{
				if (logger.isDebugEnabled())
					logger.debug("   New tag found - pushing on the stack: "+tag.getText());
				mostRecentUnclosedTag.push(tag.getText());
			}
			if (!tag.isComment())
				this.addTagToCommonTags(this.commonTags, tag);
			
			// comments can be popped from the stack as they do not contain
			// text that is displayed on screen and therefore do not contain
			// article text
			if (tag.isComment() || tag.isInlineCloseingTag())
			{
				if (logger.isDebugEnabled())
					logger.debug("Popping "+tag.getText()+" off the stack!");
				mostRecentUnclosedTag.pop();
			}
			// a closing tag was found
			// a bit care needs to be taken off on removing tags from the stack
			// as a closing tag may occur which does not have any opening tag
			// and therefore forces a flush of the whole stack!
			// Workaround: use a backup stack which fetches the elements of the 
			// origin stack and if the main stack is empty the backup stack pops 
			// every element into the main stack back
			else if (!tag.isOpeningTag())
			{
				Stack<String> backup = new Stack<String>();
				boolean done = false;
				while (!mostRecentUnclosedTag.isEmpty() && !done)
				{
					String element = mostRecentUnclosedTag.pop();
					if (logger.isDebugEnabled())
						logger.debug("Popping "+element+" from the stack");
					String e = element.substring(1, element.indexOf(" ") > -1 ? element.indexOf(" ") : element.indexOf(">"));
					if (e.equals(tag.getShortTag()))
					{
						if (logger.isDebugEnabled())
							logger.debug("   Found matching tag for "+tag.getText()+" in "+element);
						done = true;
					}
					else
					{
						if (logger.isDebugEnabled())
							logger.debug("   No match for "+tag.getText()+" and "+element+"! Pushing it on the backup stack!");
						backup.push(element);
					}
				}
				// No corresponding element was found, 
				// rebuild the stack
				if (!done)
				{
					if (logger.isDebugEnabled())
						logger.debug("Could not find "+tag+" within the stack! Rebuilding the stack");
					while (!backup.isEmpty())
					{
						String elem = backup.pop();
						if (logger.isDebugEnabled())
							logger.debug("   Popping "+elem+" from the backup stack and pushing it to the main stack");
						mostRecentUnclosedTag.push(elem);	
					}
				}
				
			}
		}
	}
	
	/**
	 * <p>This method tries to fix some HTML errors as they mey mess up the 
	 * training. Unfortunately there are a quite a lot of HTML pages that either
	 * miss some opening or closing tags or used tags in a wrong order.</p>
	 * 
	 * @param token1 Trigram part one
	 * @param token2 Trigram part two
	 * @param token3 Trigram part three
	 * @param mostRecentUnclosedTag {@link Stack} containing the currently open {@link Tag}s 
	 *                              with the {@link tag} added as last element is on the top 
	 *                              of the stack
	 * @param trigrams {@link List} of Trigrams taken from the training 
	 *                 text. These trigrams are being considered to be
	 *                 in the article
	 */
	private void buildMostRecentUnclosedTagStack_FixErrors(Token token1, Token token2, Token token3, Stack<String> mostRecentUnclosedTag, List<String> trigrams)
	{		
		if (token3.getText().toLowerCase().equals("<br>"))
		{
			if (logger.isDebugEnabled())
				logger.debug("Found "+token3.getText()+": removed "+mostRecentUnclosedTag.pop()+" from the stack - mostRecentUnclosedTag: "+mostRecentUnclosedTag.peek());
			this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
			return;
		}
		// don't pop or push </br> tags on or from the stack
		if (token3.getText().toLowerCase().startsWith("</br"))
		{
			if (logger.isDebugEnabled())
				logger.debug("Found "+token3.getText()+": leave it on the stack - mostRecentUnclosedTag: "+mostRecentUnclosedTag.peek());
			this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
			return;
		}
		
		// seldom lonely </noscript> tags appear - remove them
		if (token3.getText().toLowerCase().equals("</noscript>") && !mostRecentUnclosedTag.peek().toLowerCase().equals("<noscript>"))
		{
			if (logger.isWarnEnabled())
				logger.warn("Found lonly </noscript> tag - ignore it! mostRecentUnclosedTag: "+mostRecentUnclosedTag.peek());
			this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
			return;
		}
		// lonly </p> tag found
		if (token3.getText().toLowerCase().equals("</p>") && !mostRecentUnclosedTag.peek().toLowerCase().startsWith("<p"))
		{
			if (logger.isWarnEnabled())
				logger.warn("Found lonly </p> tag - mostRecentUnclosedTag: "+mostRecentUnclosedTag.peek()+" leave stack as it is");
			this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
			return;
		}
		
		// inline closing tag found - pop the open tag from the stack
		if (token3.getText().endsWith("/>") || 
			(mostRecentUnclosedTag.peek().endsWith(">") &&
			// catch <img ...> tags that do not end with <img ... />
			(mostRecentUnclosedTag.peek().toLowerCase().startsWith("<img") ||
			// catch <input ...> tags
			mostRecentUnclosedTag.peek().toLowerCase().startsWith("<input") ||
			// catch <meta ...> tags
			mostRecentUnclosedTag.peek().toLowerCase().startsWith("<meta"))))
		{
			// tag is now closed
			if (logger.isDebugEnabled())
				logger.debug("Got "+token3.getText()+" - popping "+mostRecentUnclosedTag.pop()+" from the stack! New mostRecentUnclosedTag: "+mostRecentUnclosedTag.peek());
			// use recent unclosed tag for training
			this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
			return;
		}
		
		// End of comment found - remove the comment from the stack, use the unclosed tag below for training
		if (token3.getText().endsWith("-->") && mostRecentUnclosedTag.peek().startsWith("<!--") ||
				(token3.getText().endsWith("]]>") && mostRecentUnclosedTag.peek().toLowerCase().startsWith("<![cdata[")))
		{
			if (logger.isDebugEnabled())
				logger.debug("Got "+token3.getText()+" - popping "+mostRecentUnclosedTag.pop()+" from the stack! New mostRecentUnclosedTag: "+mostRecentUnclosedTag.peek());
			this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
			return;
		}

		// closing tag found - pop the tag from the stack and compare if both relate to
		// the same tag - if not raise an exception as something went wrong
		if (token3.getText().startsWith("</"))
		{
			String tag = mostRecentUnclosedTag.pop();
			String closingTagName = token3.getText().replaceAll("</(.+?)>", "$1");
			String tagName = tag.substring(1, tag.indexOf(" ") > -1 ? tag.indexOf(" ") : tag.indexOf(">"));
			if (!closingTagName.equals(tagName))
			{
				// link or paragraph was not closed - ignore them
				if ((tagName.equals("a") || tagName.equals("p")) && mostRecentUnclosedTag.peek().startsWith("<"+closingTagName))
				{
					// as a closing tag for the tag below the not closed tag was found, pop this from the stack too
					// f.e:
					// <div class="c1"><div class="c2"><p>Some Text</div>...
					// </div> is the closer for <div class="c2"> and <p> is already taken from the stack
					mostRecentUnclosedTag.pop();
					if (logger.isWarnEnabled())
						logger.warn("Ignoring "+tag.toString()+" as no closing tag was found! mostRecentUnclosedTag is: "+mostRecentUnclosedTag.peek());
				}
				// no opening <a ...> tag was found - delete the closing </a> tag
				else if(tagName.equals("li") && closingTagName.equals("a"))
				{
					// as the starting tag was taken from the stack, push is back again
					mostRecentUnclosedTag.push(tag);
					if (logger.isWarnEnabled())
						logger.warn("Ignoring "+closingTagName+" as no opening tag could be found! mostRecentUnclosedTag is: "+mostRecentUnclosedTag.peek());
				}
				// lonely <li> starting tag inside <ul> tag found
				else if (tag.startsWith("<li") && closingTagName.equals("ul") && mostRecentUnclosedTag.peek().startsWith("<ul"))
				{
					// as <li> tag already got removed from the stack, 
					// remove ul as its closer tag was found
					if (logger.isWarnEnabled())
						logger.warn("Ignoring "+tag+" as no closing tag could be found! Popping "+mostRecentUnclosedTag.pop()+" from the stack as its closer tag was found! mostRecentUnclosedTag: "+mostRecentUnclosedTag.peek());
				}
				else if (tagName.equals("ul") && closingTagName.equals("li"))
				{
					mostRecentUnclosedTag.push(tag);
					if (logger.isWarnEnabled())
						logger.warn("Ignoring "+token3+" as no opening tag could be found! mostRecentUnclosedTag is: "+mostRecentUnclosedTag.peek());
				}
				else
				{
					// push back the opening tag on the stack as it was not used correctly
					mostRecentUnclosedTag.push(tag);
					if (logger.isErrorEnabled())
						logger.error("Starting and closing tag do not match! " +
							"\n\tFound opening tag: "+tagName+" ("+tag+") and closing tag: "+closingTagName +" ("+token3.getText()+")" +
									"\n\tmostRecentUnclosedTag: "+mostRecentUnclosedTag.peek());
				}
			}
		}
	}
	
	/**
	 * <p>Trains a provided {@link Classifier} with n-gram and mostRecentUnclosedTag 
	 * feature. Which kind of n-gram is used for training is defined by the 
	 * {@link TrainingStrategy} which may be set via 
	 * {@link #setTrainingStrategy(TrainingStrategy)}.</p>
	 * <p>A m-gram is a token-sequence like <ti, ti+1> or <ti, ti+1, ti+2> whereas the 
	 * mostRecentUnclosedTag represents the parent tag that contains the last added token 
	 * ti+2.</p>
	 * 
	 * @param c A {@link Classifier} which should be used for training
	 * @param t1 {@link Token} ti 
	 * @param t2 {@link Token} ti+1
	 * @param t3 {@link Token} ti+2
	 * @param mostRecentUnclosedTag Parent tag of {@link Token} ti+2
	 * @param nGrams A {@link List} of all trigrams which are considered to be article 
	 *               text (training data)
	 */
	private void train(Token t1, Token t2, Token t3, Stack<String> mostRecentUnclosedTag, List<String> nGrams)
	{
		if (t1 == null || t2 == null || t3 == null)
			throw new IllegalArgumentException("One or all provided tokens are null");
		if (nGrams == null || nGrams.isEmpty())
			throw new IllegalArgumentException("No n-Grams provided");
		int includeMRUT = 0;
		if (mostRecentUnclosedTag == null)
			includeMRUT = 1;
		else if (mostRecentUnclosedTag != null && mostRecentUnclosedTag.isEmpty())
		{
			if (logger.isWarnEnabled())
				logger.warn("Empty stack for trigram: '"+t1.getText()+" "+t2.getText()+" "+t3.getText()+"' source: "+this.getUrl());
			return;
		}

		// stem words
		String _t1 = t1.getText();
		if (t1 instanceof Word)
			_t1 = Parser.formatText(_t1);
		String _t2 = t2.getText();
		if (t2 instanceof Word)
			_t2 = Parser.formatText(_t2);
		String _t3 = t3.getText();
		if (t3 instanceof Word)
			_t3 = Parser.formatText(_t3);
		
		String categorie = "out";		
		String[] feature = null;
		if (this.trainingStrategy.equals(TrainingStrategy.TRIGRAM))
		{			
			feature = new String[2-includeMRUT];
			feature[0] = _t1+" "+_t2+" "+_t3;
			if (mostRecentUnclosedTag != null)
				feature[1] = mostRecentUnclosedTag.peek();
			
			if (nGrams.contains(feature[0]))
				categorie = "in";
		}
		else if (this.trainingStrategy.equals(TrainingStrategy.BIGRAM))
		{
			feature = new String[2-includeMRUT];
			feature[0] = _t2+" "+_t3;
			if (mostRecentUnclosedTag != null)
				feature[1] = mostRecentUnclosedTag.peek();
			
			if (nGrams.contains(feature[0]))
				categorie = "in";
		}
		else if (this.trainingStrategy.equals(TrainingStrategy.UNIGRAM))
		{
			feature = new String[2-includeMRUT];
			feature[0] = _t3;
			if (mostRecentUnclosedTag != null)
				feature[1] = mostRecentUnclosedTag.peek();
			
			if (nGrams.contains(feature[0]))
				categorie = "in";
		}
		else if (this.trainingStrategy.equals(TrainingStrategy.DOUBLE_UNIGRAM))
		{
			feature = new String[3-includeMRUT];
			feature[0] = _t2;
			feature[1] = _t3;
			if (mostRecentUnclosedTag != null)
				feature[2] = mostRecentUnclosedTag.peek();
			
			if (nGrams.contains(feature[0]+" "+feature[1]))
				categorie = "in";
		}
		else if (this.trainingStrategy.equals(TrainingStrategy.TRIPLE_UNIGRAM))
		{
			feature = new String[4-includeMRUT];
			feature[0] = _t1;
			feature[1] = _t2;
			feature[2] = _t3;
			if (mostRecentUnclosedTag != null)
				feature[3] = mostRecentUnclosedTag.peek();
			
			if (nGrams.contains(feature[0]+" "+feature[1]+" "+feature[2]))
				categorie = "in";
		}
		
		if (logger.isDebugEnabled())
			logger.debug("classifiying as "+categorie+": "+Arrays.toString(feature));
		this.classifier.train(feature, categorie);
	}
	
	/**
	 * <p>Trains a provided {@link Classifier} with a n-gram feature. Which kind of
	 * n-gram is used for training is defined by the {@link TrainingStrategy} which may
	 * be set via {@link #setTrainingStrategy(TrainingStrategy)}.</p>
	 * <p>A n-gram is a token-sequence like <ti, ti+1> or <ti, ti+1, ti+2>.</p>
	 * 
	 * @param c A {@link Classifier} which should be used for training
	 * @param t1 {@link Token} ti 
	 * @param t2 {@link Token} ti+1
	 * @param t3 {@link Token} ti+2
	 * @param nGrams A {@link List} of all n-grams which are considered to be article 
	 *               text (training data)
	 */
	private void train(Token t1, Token t2, Token t3, List<String> nGrams)
	{
		this.train(t1, t2, t3, null, nGrams);
	}
}
