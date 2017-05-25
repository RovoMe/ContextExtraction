package at.rovo.textextraction.mss;

import at.rovo.classifier.Classifier;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.ParserUtil;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.stemmer.PorterStemmer;
import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Dictionary;
import java.util.List;
import java.util.Stack;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Represents a training entry for the maximum subsequence segmentation algorithm.
 *
 * @author Roman Vottner
 */
public class TrainingEntry
{
    /** The LOG of this instance **/
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    /** Web address (URL) of this entry **/
    private String url = "";
    /** The source domain of this entry (first part of the URL) **/
    private String source = "";
    /** HTML code of the page **/
    private String html = "";
    /** Training text **/
    private String text = "";
    /** Category of this entry **/
    private String category = "";
    /** Classifier of this entry **/
    private Classifier<String, String> classifier = null;
    /** List of common tags **/
    private Dictionary<String, List<String>> commonTags = null;
    /**
     * Specifies if this entry was used for training or still needs to be trained
     */
    private boolean trained = false;
    /** List of tokens representing the HTML page **/
    private List<Token> tokens = null;
    /** The text as tokens **/
    private List<Token> tokenText = null;
    /**
     * Specifies if the most recent unclosed tag stack should be used as a feature for the classifier training
     */
    private boolean useMostRecentUnclosedTagFeature = true;
    /** The used training strategy **/
    private TrainFeatureStrategy trainFeatureStrategy = TrainFeatureStrategy.TRIPLE_UNIGRAM;

    /** The parser used to download the content from pages on the Internet **/
    private Parser parser = null;

    /**
     * Creates a new default instance of this class
     */
    public TrainingEntry()
    {
        this.parser = new Parser();
    }

    /**
     * Creates a new instance of this class and initializes important attributes
     *
     * @param url
     *         URL of this entry
     * @param text
     *         Text which should be used for training
     * @param category
     *         Category of the article this entry is representing
     */
    public TrainingEntry(String url, String text, String category)
    {
        this();

        this.url = url;
        this.text = text;
        this.category = category;
    }

    /**
     * Creates a new instance of this class and initializes important attributes
     *
     * @param url
     *         URL of this entry
     * @param text
     *         Text which should be used for training
     * @param category
     *         Category of the article this entry is representing
     * @param classifier
     *         Classifier which should be trained
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
     * Creates a new instance of this class and initializes important attributes
     *
     * @param html
     *         The origin page as a {@link List} of {@link Token}s
     * @param text
     *         The actual content to train the classifier as a {@link List} of {@link Token}s
     * @param classifier
     *         Classifier which should be trained
     */
    public TrainingEntry(List<Token> html, List<Token> text, Classifier<String, String> classifier,
                         boolean useMostRecentUnclosedTagFeature)
    {
        this();

        this.tokens = html;
        this.tokenText = text;
        this.classifier = classifier;
        this.useMostRecentUnclosedTagFeature = useMostRecentUnclosedTagFeature;
    }

    /**
     * Returns the URL of this entry as a {@link String} object
     *
     * @return The specified URL of this entry
     */
    public String getUrl()
    {
        return this.url;
    }

    /**
     * Returns the first part of the URL, f.e. www.java.com
     *
     * @return The specified source URL of this entry
     */
    public String getSourceUrl()
    {
        return this.source;
    }

    /**
     * Returns the text this entry uses for training
     *
     * @return The specified training text of this entry
     */
    public String getText()
    {
        return this.text;
    }

    /**
     * Returns the category this entry was labeled with for further training
     *
     * @return The specified category of this entry.
     */
    public String getCategory()
    {
        return this.category;
    }

    /**
     * Returns the specified {@link Classifier}
     *
     * @return The specified {@link Classifier}, null if none has been specified
     */
    public Classifier<String, String> getClassifier()
    {
        return this.classifier;
    }

    /**
     * Returns the list of common tags
     *
     * @return The list of common tags
     */
    public Dictionary<String, List<String>> getCommonTags()
    {
        return this.commonTags;
    }

    /**
     * Specifies if this entry has already been used for training or not
     *
     * @return true if this entry has already been used for training, false otherwise
     */
    public boolean isTrained()
    {
        return this.trained;
    }

    /**
     * Returns the tokens of the trained document. If the entry has not been trained yet null will be returned.
     *
     * @return The tokens of the trained document. If the entry has not been trained yet null will be returned.
     */
    public List<Token> getTokens()
    {
        if (this.isTrained())
        {
            return this.tokens;
        }
        return null;
    }

    /**
     * Sets the strategy for training tokens to the local classifier. {@link TrainFeatureStrategy#TRIGRAM} will train a
     * trigram, f.e. 'token1 token2 token3' while {@link TrainFeatureStrategy#TRIPLE_UNIGRAM} will train 'token1',
     * 'token2', 'token3' with the classifier.
     * <p>
     * By default the system will use {@link TrainFeatureStrategy#TRIPLE_UNIGRAM}
     *
     * @param strategy
     *         The strategy to be used for training
     */
    public void setTrainFeatureStrategy(TrainFeatureStrategy strategy)
    {
        this.trainFeatureStrategy = strategy;
    }

    /**
     * Returns the currently set training strategy. By default {@link TrainFeatureStrategy#TRIPLE_UNIGRAM} will be
     * taken
     *
     * @return The currently used strategy for training new samples
     */
    public TrainFeatureStrategy getTrainFeatureStrategy()
    {
        return this.trainFeatureStrategy;
    }

    /**
     * Sets the URL of the article this entry is relating to
     *
     * @param url
     *         URL of the article
     */
    public void setUrl(String url)
    {
        this.url = url;
    }

    /**
     * Sets the source URL of the article this entry is relating to
     *
     * @param source
     *         The source URL of the article, f.e. www.java.com
     */
    public void setSourceUrl(String source)
    {
        this.source = source;
    }

    /**
     * Sets the full HTML code of the article
     *
     * @param html
     *         The HTML code of the article
     */
    public void setHTML(String html)
    {
        this.html = html;
    }

    /**
     * Sets the text which should be used to train the {@link Classifier} to distinguish if a {@link Token} is
     * considered to be "in" the article or "out".
     * <p>
     * This method will call {@link ParserUtil#formatText(String)} to format the text. If the text should be used as is
     * use {@link #setFormatedText(String)} instead.
     *
     * @param text
     *         Text that should be used for training the {@link Classifier}
     */
    public void setText(String text)
    {
        this.text = ParserUtil.formatText(text);
    }

    /**
     * Sets the text which should be used to train the {@link Classifier} to distinguish if a {@link Token} is
     * considered to be "in" the article or "out".
     * <p>
     * This method sets the text as provided without any reformatting.
     *
     * @param text
     *         Text that should be used for training the {@link Classifier}
     */
    public void setFormatedText(String text)
    {
        this.text = text;
    }

    /**
     * Sets the category the article is considered to be.
     *
     * @param category
     *         Category of the article
     */
    public void setCategory(String category)
    {
        this.category = category;
    }

    /**
     * Sets the {@link Classifier} that should be used for training
     *
     * @param classifier
     *         {@link Classifier}
     */
    public void setClassifier(Classifier<String, String> classifier)
    {
        this.classifier = classifier;
    }

    /**
     * Sets the list of common tags including their sources
     *
     * @param commonTags
     *         The list including the common tags and their sources
     */
    public void setCommonTags(Dictionary<String, List<String>> commonTags)
    {
        this.commonTags = commonTags;
    }

    /**
     * Trains this entry using the specified {@link Classifier} and the training text which marks the actual content of
     * the article this instance is representing.
     * <p>
     * It first tries to fetch the data from the web in case a URL was specified and no HTML text was set else the HTML
     * text is taken and split up into {@link Token}s.
     *
     * @param fixErrors
     *         Indicate if the algorithm should try to fix HTML errors like unclosed tags (&lt;div>&lt;p>...&lt;/div>)
     *         or misspelled tags like &lt/br>. <p> Note however that this is experimental and might not work as
     *         expected! </p>
     *
     * @throws IllegalArgumentException
     *         If no {@link Classifier} or no text to train the {@link Classifier} was specified
     */
    public void train(final boolean fixErrors) throws IllegalArgumentException
    {
        // build token sequence if there doesn't exist any yet
        if (this.tokens == null)
        {
            if (this.html.equals(""))
            {
                this.tokens = this.parser.tokenizeURL(this.url, true).getParsedTokens();
            }
            else
            {
                this.tokens = this.parser.tokenize(this.html, true).getParsedTokens();
            }
        }
        LOG.debug("Tokens: {}", this.tokens);

        if (this.classifier == null)
        {
            LOG.error("No classifier to train was specified!");
            throw new IllegalArgumentException("No classifier to train was specified!");
        }

        if (this.tokenText == null && (this.text == null || this.text.length() < 3))
        {
            LOG.error("Training text is to short");
            throw new IllegalArgumentException("Training text is to short");
        }

        LOG.info("Start training on {}", this.url);

        // build tri-/bi- or unigrams depending on the selected strategy
        List<String> nGrams;
        if (this.tokenText != null && this.tokenText.size() > 0)
        {
            LOG.debug("Building N-Grams with {}", this.tokenText);
            nGrams = this.buildNgrams(this.tokenText);
        }
        else
        {
            LOG.debug("Building N-Grams with {}", this.text);
            nGrams = this.buildNgrams(this.text);
        }
        LOG.debug("Trigrams: {}", nGrams);

        int end = 0;
        if (TrainFeatureStrategy.BIGRAM.equals(this.trainFeatureStrategy))
        {
            end = 1;
        }
        else if (TrainFeatureStrategy.TRIGRAM.equals(this.trainFeatureStrategy))
        {
            end = 2;
        }

        Stack<String> mostRecentUnclosedTag = null;
        if (this.useMostRecentUnclosedTagFeature)
        {
            mostRecentUnclosedTag = new Stack<>();
        }

        Token token1 = null;
        Token token2 = null;
        for (int i = 0; i < this.tokens.size() - end; i++)
        {
            Token token = this.tokens.get(i);

            if (i >= 2)
            {
                if (TrainFeatureStrategy.TRIGRAM.equals(this.trainFeatureStrategy))
                {
                    if (token1 != null)
                    {
                        LOG.debug("examin: '{}' '{}' '{}'",
                                  (token1.getText() != null ? token1.getText() : token1.getHTML()),
                                  (token2.getText() != null ? token2.getText() : token2.getHTML()),
                                  (token.getText() != null ? token.getText() : token.getHTML()));
                    }
                }
                else if (TrainFeatureStrategy.BIGRAM.equals(this.trainFeatureStrategy))
                {
                    if (token2 != null)
                    {
                        LOG.debug("examin: '{}' '{}'",
                                  (token2.getText() != null ? token2.getText() : token2.getHTML()),
                                  (token.getText() != null ? token.getText() : token.getHTML()));
                    }
                }
            }

            if (this.useMostRecentUnclosedTagFeature)
            {
                if (fixErrors)
                {
                    this.buildMostRecentUnclosedTagStack_FixErrors(token1, token2, token, mostRecentUnclosedTag,
                                                                   nGrams);
                }
                else
                {
                    this.buildMostRecentUnclosedTagStack(token, mostRecentUnclosedTag);
                }

                if (i >= 2)
                {
                    this.train(token1, token2, token, mostRecentUnclosedTag, nGrams);
                }
            }
            else if (i >= 2)
            {
                this.train(token1, token2, token, nGrams);
            }

            token1 = token2;
            token2 = token;
        }

        this.trained = true;
    }

    /**
     * Adds a {@link Tag} to the list of common tags
     *
     * @param commonTags
     *         The list of common tags
     * @param tag
     *         The {@link Tag} to include in the list.
     */
    private void addTagToCommonTags(Dictionary<String, List<String>> commonTags, Tag tag)
    {
        if (this.source == null || this.source.equals(""))
        {
            throw new IllegalArgumentException("No source was defined for this entry!");
        }

        if (tag.getShortTag().trim().equals(""))
        {
            return;
        }
        List<String> sources = commonTags.get(tag.getShortTag().toLowerCase());
        if (sources == null)
        {
            sources = new ArrayList<>();
            sources.add(this.source);
            commonTags.put(tag.getShortTag().toLowerCase(), sources);
            LOG.debug("New tag found: '{}', source: {}", tag.getShortTag().toLowerCase(), this.source);
        }
        else
        {
            if (!sources.contains(this.source))
            {
                sources.add(this.source);
                LOG.debug("Tag found: '{}', new source: {}", tag.getShortTag().toLowerCase(), this.source);
            }
        }
    }

    /**
     * Builds an n-gram list from a provided text. It therefore splits the text on blank symbols into a list of {@link
     * Token Tokens} and takes up to three consecutive tokens to form a n-gram.
     *
     * @param text
     *         The text which should be split up into a n-grams
     *
     * @return Returns a list of n-grams extracted from the provided text
     *
     * @throws IllegalArgumentException
     *         if the provided text does not contain enough tokens to build a n-gram
     */
    private List<String> buildNgrams(String text)
    {
        // The text might have to be formatted as <p>Text does not
        // get split up correctly
        ParseResult result = parser.tokenize(text.trim(), true);
        return this.buildNgrams(result.getParsedTokens());
    }

    /**
     * Builds an n-gram list from a provided text. It therefore splits the text on blank symbols into a list of {@link
     * Token Tokens} and takes up to three consecutive tokens to form an n-gram.
     *
     * @param tokens
     *         The tokens which should be split up into an n-grams
     *
     * @return Returns a list of n-grams extracted from the provided text
     *
     * @throws IllegalArgumentException
     *         if the provided text does not contain enough tokens to build a n-gram
     */
    private List<String> buildNgrams(final List<Token> tokens)
    {
        List<String> nGrams = new ArrayList<>();

        int start = 0;
        if (TrainFeatureStrategy.BIGRAM.equals(this.trainFeatureStrategy))
        {
            start = 1;
        }
        else if (TrainFeatureStrategy.TRIGRAM.equals(this.trainFeatureStrategy))
        {
            start = 2;
        }

        if (tokens.size() < start + 1)
        {
            LOG.error("The provided text does not contain enough tokens to build a {}! {}",
                      this.trainFeatureStrategy.name(), tokens);
            throw new IllegalArgumentException(
                    "The provided text does not contain enough tokens to build a " + this.trainFeatureStrategy.name() +
                    "! " + tokens);
        }

        for (int i = start; i < tokens.size(); i++)
        {
            if (TrainFeatureStrategy.TRIGRAM.equals(this.trainFeatureStrategy))
            {
                String t1 = (tokens.get(i - 2).getText() != null ? tokens.get(i - 2).getText() :
                        tokens.get(i - 2).getHTML());
                if (tokens.get(i - 2) instanceof Word)
                {
                    t1 = PorterStemmer.stem(t1);
                }
                String t2 = (tokens.get(i - 1).getText() != null ? tokens.get(i - 1).getText() :
                        tokens.get(i - 1).getHTML());
                if (tokens.get(i - 1) instanceof Word)
                {
                    t2 = PorterStemmer.stem(t2);
                }
                String t3 = (tokens.get(i).getText() != null ? tokens.get(i).getText() : tokens.get(i).getHTML());
                if (tokens.get(i) instanceof Word)
                {
                    t3 = PorterStemmer.stem(t3);
                }

                LOG.debug("trigram: {} {} {}", t1, t2, t3);

                nGrams.add(t1 + " " + t2 + " " + t3);
            }
            else if (TrainFeatureStrategy.BIGRAM.equals(this.trainFeatureStrategy))
            {
                String t2 = (tokens.get(i - 1).getText() != null ? tokens.get(i - 1).getText() :
                        tokens.get(i - 1).getHTML());
                if (tokens.get(i - 1) instanceof Word)
                {
                    t2 = PorterStemmer.stem(t2);
                }
                String t3 = (tokens.get(i).getText() != null ? tokens.get(i).getText() : tokens.get(i).getHTML());
                if (tokens.get(i) instanceof Word)
                {
                    t3 = PorterStemmer.stem(t3);
                }

                LOG.debug("bigram: {} {}", t2, t3);
                nGrams.add(t2 + " " + t3);
            }
            else
            {
                String t3 = (tokens.get(i).getText() != null ? tokens.get(i).getText() : tokens.get(i).getHTML());
                if (tokens.get(i) instanceof Word)
                {
                    t3 = PorterStemmer.stem(t3);
                }

                LOG.debug("unigram: {}", t3);
                nGrams.add(t3);
            }
        }
        return nGrams;
    }

    /**
     * Uses a simple heuristic to train the {@link Classifier}.
     * <p>
     * When a new opening tag is encountered, it is added to the stack. When a closing tag is found, the stack unwinds
     * until a corresponding opening tag is matched and removed.
     *
     * @param token
     *         The token to generate a stack entry for
     * @param mostRecentUnclosedTag
     *         {@link Stack} containing the currently open {@link Tag}s with the {@link Tag} added as last element is on
     *         the top of the stack
     */
    private void buildMostRecentUnclosedTagStack(Token token, Stack<String> mostRecentUnclosedTag)
    {
        if (token instanceof Tag)
        {
            Tag tag = (Tag) token;

            if (tag.isOpeningTag())
            {
                LOG.debug("   New tag found - pushing on the stack: {}", tag.getHTML());
                mostRecentUnclosedTag.push(tag.getHTML());
            }
            if (!tag.isComment())
            {
                this.addTagToCommonTags(this.commonTags, tag);
            }

            // comments can be popped from the stack as they do not contain text that is displayed on screen and
            // therefore do not contain article text
            if (tag.isComment() || tag.isInlineClosingTag())
            {
                LOG.debug("Popping {} off the stack!", tag.getHTML());
                mostRecentUnclosedTag.pop();
            }
            // a closing tag was found
            // a bit care needs to be taken off on removing tags from the stack as a closing tag may occur which does
            // not have any opening tag and therefore forces a flush of the whole stack!
            // Workaround: use a backup stack which fetches the elements of the origin stack and if the main stack is
            // empty the backup stack pops every element into the main stack back
            else if (!tag.isOpeningTag())
            {
                Stack<String> backup = new Stack<>();
                boolean done = false;
                while (!mostRecentUnclosedTag.isEmpty() && !done)
                {
                    String element = mostRecentUnclosedTag.pop();
                    LOG.debug("Popping {} from the stack", element);
                    String e =
                            element.substring(1, element.contains(" ") ? element.indexOf(" ") : element.indexOf(">"));
                    if (e.equals(tag.getShortTag()))
                    {
                        LOG.debug("   Found matching tag for {} in {}", tag.getHTML(), element);
                        done = true;
                    }
                    else
                    {
                        LOG.debug("   No match for {} and {}! Pushing it on the backup stack!", tag.getHTML(), element);
                        backup.push(element);
                    }
                }
                // No corresponding element was found,
                // rebuild the stack
                if (!done)
                {
                    LOG.debug("Could not find {} within the stack! Rebuilding the stack", tag);
                    while (!backup.isEmpty())
                    {
                        String elem = backup.pop();
                        LOG.debug("   Popping {} from the backup stack and pushing it to the main stack", elem);
                        mostRecentUnclosedTag.push(elem);
                    }
                }

            }
        }
    }

    /**
     * This method tries to fix some HTML errors as they mey mess up the training. Unfortunately there are a quite a lot
     * of HTML pages that either miss some opening or closing tags or used tags in a wrong order.
     *
     * @param token1
     *         Trigram part one
     * @param token2
     *         Trigram part two
     * @param token3
     *         Trigram part three
     * @param mostRecentUnclosedTag
     *         {@link Stack} containing the currently open {@link Tag}s with the {@link Tag} added as last element is on
     *         the top of the stack
     * @param trigrams
     *         {@link List} of Trigrams taken from the training text. These trigrams are being considered to be in the
     *         article
     */
    private void buildMostRecentUnclosedTagStack_FixErrors(Token token1, Token token2, Token token3,
                                                           Stack<String> mostRecentUnclosedTag, List<String> trigrams)
    {
        if (token3.getHTML() != null && token3.getHTML().toLowerCase().equals("<br>"))
        {
            LOG.debug("Found {}: removed {} from the stack - mostRecentUnclosedTag: {}", token3.getHTML(),
                      mostRecentUnclosedTag.pop(), mostRecentUnclosedTag.peek());
            this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
            return;
        }
        // don't pop or push </br> tags on or from the stack
        if (token3.getHTML() != null && token3.getHTML().toLowerCase().startsWith("</br"))
        {
            LOG.debug("Found {}: leave it on the stack - mostRecentUnclosedTag: {}", token3.getHTML(),
                      mostRecentUnclosedTag.peek());
            this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
            return;
        }

        // seldom lonely </noscript> tags appear - remove them
        if (token3.getHTML() != null && token3.getHTML().toLowerCase().equals("</noscript>") &&
            !mostRecentUnclosedTag.peek().toLowerCase().equals("<noscript>"))
        {
            LOG.warn("Found lonly </noscript> tag - ignore it! mostRecentUnclosedTag: {}",
                     mostRecentUnclosedTag.peek());
            this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
            return;
        }
        // lonly </p> tag found
        if (token3.getHTML() != null && token3.getHTML().toLowerCase().equals("</p>") &&
            !mostRecentUnclosedTag.peek().toLowerCase().startsWith("<p"))
        {
            LOG.warn("Found lonly </p> tag - mostRecentUnclosedTag: {} leave stack as it is",
                     mostRecentUnclosedTag.peek());
            this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
            return;
        }

        // inline closing tag found - pop the open tag from the stack
        if (token3.getHTML() != null &&
            (token3.getHTML().endsWith("/>") || (mostRecentUnclosedTag.peek().endsWith(">") &&
                                                 // catch <img ...> tags that do not end with <img ... />
                                                 (mostRecentUnclosedTag.peek().toLowerCase().startsWith("<img") ||
                                                  // catch <input ...> tags
                                                  mostRecentUnclosedTag.peek().toLowerCase().startsWith("<input") ||
                                                  // catch <meta ...> tags
                                                  mostRecentUnclosedTag.peek().toLowerCase().startsWith("<meta")))))
        {
            // tag is now closed
            LOG.debug("Got {} - popping {} from the stack! New mostRecentUnclosedTag: {}", token3.getHTML(),
                      mostRecentUnclosedTag.pop(), mostRecentUnclosedTag.peek());
            // use recent unclosed tag for training
            this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
            return;
        }

        // End of comment found - remove the comment from the stack, use the unclosed tag below for training
        if (token3.getHTML() != null &&
            (token3.getHTML().endsWith("-->") && mostRecentUnclosedTag.peek().startsWith("<!--") ||
             (token3.getHTML().endsWith("]]>") && mostRecentUnclosedTag.peek().toLowerCase().startsWith("<![cdata["))))
        {
            LOG.debug("Got {} - popping {} from the stack! New mostRecentUnclosedTag: {}", token3.getHTML(),
                      mostRecentUnclosedTag.pop(), mostRecentUnclosedTag.peek());
            this.train(token1, token2, token3, mostRecentUnclosedTag, trigrams);
            return;
        }

        // closing tag found - pop the tag from the stack and compare if both relate to the same tag - if not raise an
        // exception as something went wrong
        if (token3.getHTML() != null && token3.getHTML().startsWith("</"))
        {
            String tag = mostRecentUnclosedTag.pop();
            String closingTagName = token3.getHTML().replaceAll("</(.+?)>", "$1");
            String tagName = tag.substring(1, tag.contains(" ") ? tag.indexOf(" ") : tag.indexOf(">"));
            if (!closingTagName.equals(tagName))
            {
                // link or paragraph was not closed - ignore them
                if ((tagName.equals("a") || tagName.equals("p")) &&
                    mostRecentUnclosedTag.peek().startsWith("<" + closingTagName))
                {
                    // as a closing tag for the tag below the not closed tag was found, pop this from the stack too f.e:
                    // <div class="c1"><div class="c2"><p>Some Text</div>...
                    // </div> is the closer for <div class="c2"> and <p> is
                    // already taken from the stack
                    mostRecentUnclosedTag.pop();
                    LOG.warn("Ignoring {} as no closing tag was found! mostRecentUnclosedTag is: {}", tag,
                             mostRecentUnclosedTag.peek());
                }
                // no opening <a ...> tag was found - delete the closing </a> tag
                else if (tagName.equals("li") && closingTagName.equals("a"))
                {
                    // as the starting tag was taken from the stack, push is back again
                    mostRecentUnclosedTag.push(tag);
                    LOG.warn("Ignoring {} as no opening tag could be found! mostRecentUnclosedTag is: {}",
                             closingTagName, mostRecentUnclosedTag.peek());
                }
                // lonely <li> starting tag inside <ul> tag found
                else if (tag.startsWith("<li") && closingTagName.equals("ul") &&
                         mostRecentUnclosedTag.peek().startsWith("<ul"))
                {
                    // as <li> tag already got removed from the stack, remove ul as its closer tag was found
                    LOG.warn("Ignoring {} as no closing tag could be found! Popping {} " +
                             "from the stack as its closer tag was found! mostRecentUnclosedTag: {}", tag,
                             mostRecentUnclosedTag.pop(), mostRecentUnclosedTag.peek());
                }
                else if (tagName.equals("ul") && closingTagName.equals("li"))
                {
                    mostRecentUnclosedTag.push(tag);
                    LOG.warn("Ignoring {} as no opening tag could be found! mostRecentUnclosedTag is: {}", token3,
                             mostRecentUnclosedTag.peek());
                }
                else
                {
                    // push back the opening tag on the stack as it was not used correctly
                    mostRecentUnclosedTag.push(tag);
                    LOG.error("Starting and closing tag do not match! \n" +
                              "\tFound opening tag: {} ({}) and closing tag: {} ({})" +
                              "\n\tmostRecentUnclosedTag: {}", tagName, tag, closingTagName, token3.getHTML(),
                              mostRecentUnclosedTag.peek());
                }
            }
        }
    }

    /**
     * Trains a provided {@link Classifier} with n-gram and mostRecentUnclosedTag feature. Which kind of n-gram is used
     * for training is defined by the {@link TrainFeatureStrategy} which may be set via {@link
     * #setTrainFeatureStrategy(TrainFeatureStrategy)}.
     * <p>
     * A m-gram is a token-sequence like <ti, ti+1> or <ti, ti+1, ti+2> whereas the mostRecentUnclosedTag represents the
     * parent tag that contains the last added token ti+2.
     *
     * @param t1
     *         {@link Token} ti
     * @param t2
     *         {@link Token} ti+1
     * @param t3
     *         {@link Token} ti+2
     * @param mostRecentUnclosedTag
     *         Parent tag of {@link Token} ti+2
     * @param nGrams
     *         A {@link List} of all trigrams which are considered to be article text (training data)
     */
    private void train(Token t1, Token t2, Token t3, Stack<String> mostRecentUnclosedTag, List<String> nGrams)
    {
        if (t1 == null || t2 == null || t3 == null)
        {
            throw new IllegalArgumentException("One or all provided tokens are null");
        }
        if (nGrams == null || nGrams.isEmpty())
        {
            throw new IllegalArgumentException("No n-Grams provided");
        }
        int includeMRUT = 0;
        if (mostRecentUnclosedTag == null)
        {
            includeMRUT = 1;
        }
        else if (mostRecentUnclosedTag.isEmpty())
        {
            LOG.warn("Empty stack for trigram: '{} {} {}' source: {}",
                     (t1.getText() != null ? t1.getText() : t1.getHTML()),
                     (t2.getText() != null ? t2.getText() : t2.getHTML()),
                     (t3.getText() != null ? t3.getText() : t3.getHTML()), this.getUrl());
            return;
        }

        // stem words
        String _t1 = (t1.getText() != null ? t1.getText() : t1.getHTML());
        if (t1 instanceof Word)
        {
            _t1 = ParserUtil.formatText(_t1);
        }
        String _t2 = (t2.getText() != null ? t2.getText() : t2.getHTML());
        if (t2 instanceof Word)
        {
            _t2 = ParserUtil.formatText(_t2);
        }
        String _t3 = (t3.getText() != null ? t3.getText() : t3.getHTML());
        if (t3 instanceof Word)
        {
            _t3 = ParserUtil.formatText(_t3);
        }

        String categorie = "out";
        String[] feature = null;
        if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.TRIGRAM))
        {
            feature = new String[2 - includeMRUT];
            feature[0] = _t1 + " " + _t2 + " " + _t3;
            if (mostRecentUnclosedTag != null)
            {
                feature[1] = mostRecentUnclosedTag.peek();
            }

            if (nGrams.contains(feature[0]))
            {
                categorie = "in";
            }
        }
        else if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.BIGRAM))
        {
            feature = new String[2 - includeMRUT];
            feature[0] = _t2 + " " + _t3;
            if (mostRecentUnclosedTag != null)
            {
                feature[1] = mostRecentUnclosedTag.peek();
            }

            if (nGrams.contains(feature[0]))
            {
                categorie = "in";
            }
        }
        else if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.UNIGRAM))
        {
            feature = new String[2 - includeMRUT];
            feature[0] = _t3;
            if (mostRecentUnclosedTag != null)
            {
                feature[1] = mostRecentUnclosedTag.peek();
            }

            if (nGrams.contains(feature[0]))
            {
                categorie = "in";
            }
        }
        else if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.DOUBLE_UNIGRAM))
        {
            feature = new String[3 - includeMRUT];
            feature[0] = _t2;
            feature[1] = _t3;
            if (mostRecentUnclosedTag != null)
            {
                feature[2] = mostRecentUnclosedTag.peek();
            }

            if (nGrams.contains(feature[0] + " " + feature[1]))
            {
                categorie = "in";
            }
        }
        else if (this.trainFeatureStrategy.equals(TrainFeatureStrategy.TRIPLE_UNIGRAM))
        {
            feature = new String[4 - includeMRUT];
            feature[0] = _t1;
            feature[1] = _t2;
            feature[2] = _t3;
            if (mostRecentUnclosedTag != null)
            {
                feature[3] = mostRecentUnclosedTag.peek();
            }

            if (nGrams.contains(feature[0] + " " + feature[1] + " " + feature[2]))
            {
                categorie = "in";
            }
        }

        LOG.debug("classifiying as {}: {}", categorie, Arrays.toString(feature));
        this.classifier.train(feature, categorie);
    }

    /**
     * Trains a provided {@link Classifier} with a n-gram feature. Which kind of n-gram is used for training is defined
     * by the {@link TrainFeatureStrategy} which may be set via {@link #setTrainFeatureStrategy(TrainFeatureStrategy)}.
     * <p>
     * A n-gram is a token-sequence like <ti, ti+1> or <ti, ti+1, ti+2>.
     *
     * @param t1
     *         {@link Token} ti
     * @param t2
     *         {@link Token} ti+1
     * @param t3
     *         {@link Token} ti+2
     * @param nGrams
     *         A {@link List} of all n-grams which are considered to be article text (training data)
     */
    private void train(Token t1, Token t2, Token t3, List<String> nGrams)
    {
        this.train(t1, t2, t3, null, nGrams);
    }
}
