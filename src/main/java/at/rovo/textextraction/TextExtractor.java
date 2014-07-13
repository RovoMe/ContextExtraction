package at.rovo.textextraction;

import java.io.File;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.Hashtable;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import at.rovo.classifier.naiveBayes.NaiveBayes;
import at.rovo.classifier.naiveBayes.ProbabilityCalculation;
import at.rovo.classifier.naiveBayes.TrainingDataStorageMethod;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.textextraction.mss.TrainFeatureStrategy;

/**
 * <p>
 * Is the base class for every text extraction algorithm.
 * </p>
 * <p>
 * Text extraction algorithm should have the possibility to predict the text
 * from training examples.
 * </p>
 * <p>
 * Of course there is also the wish to extract the text of an article or web
 * page.
 * </p>
 * 
 * @see at.rovo.textextraction.mss.MaximumSubsequenceSegmentation
 * @author Roman Vottner
 */
@SuppressWarnings("unused")
public abstract class TextExtractor 
{
	/** The logger of this class **/
	private static Logger LOG = LogManager.getLogger(TextExtractor.class.getName());
	/** Defines the source where to train the classifier from **/
	protected TrainData trainFrom = TrainData.FILE;
	/** The classifier which needs to be trained **/
	protected NaiveBayes<String, String> classifier = null;
	/** The map-structure containing common tags shared by multiple sources **/
	protected Dictionary<String, List<String>> commonTags = new Hashtable<>();
	/** Indicates if the instance is trained or is in need of training **/
	protected boolean isTrained = false;
	/** Specifies how many tokens should be combined or how many features built
	 * from training data examples **/
	protected TrainFeatureStrategy trainFeatureStrategy = TrainFeatureStrategy.TRIPLE_UNIGRAM;
	/** Specifies how many samples per sources should be trained **/
	protected int trainingSampleSize = 0;
	/** Specifies in which form data inside the classifier should be stored **/
	protected TrainingDataStorageMethod storageMethod = TrainingDataStorageMethod.MAP;
	/** Specifies the probability calculation of the naive Bayes classifier to 
	 * be used**/
	protected ProbabilityCalculation probCalc = ProbabilityCalculation.EVEN_LIKELIHOOD;
	
	/**
	 * <p>Returns the currently set strategy for training new samples.
	 * By default {@link at.rovo.textextraction.mss.TrainFeatureStrategy#TRIPLE_UNIGRAM} is set</p>
	 * 
	 * @return The currently set strategy for training new samples
	 */
	public TrainFeatureStrategy getTrainFeatureStrategy()
	{ 
		return this.trainFeatureStrategy;
	}
	
	/**
	 * <p>Sets the new strategy for training new samples to the classifier. 
	 * {@link at.rovo.textextraction.mss.TrainFeatureStrategy#TRIGRAM} will train f.e. 'token1 token2 token3'
	 * to the classifier while {@link at.rovo.textextraction.mss.TrainFeatureStrategy#TRIPLE_UNIGRAM} will
	 * train 'token1', 'token2', 'token3' as either 'in' or 'out' to the
	 * classifier.</p>
	 * 
	 * @param trainFeatureStrategy The training strategy to be used
	 */
	public void setTrainFeatureStrategy(TrainFeatureStrategy trainFeatureStrategy)
	{ 
		this.trainFeatureStrategy = trainFeatureStrategy;
	}
	
	/**
	 * <p>Returns the storage format of the training data inside the naive Bayes
	 * classifier.</p>
	 * 
	 * @return The storage method used by the classifier to store training data
	 */
	public TrainingDataStorageMethod getTrainingDataStorageMethod()
	{
		return this.storageMethod;
	}
	
	/**
	 * <p>Defines the format which should be used by the naive Bayes classifier
	 * to store the training data.</p>
	 * 
	 * @param storageMethod The storage method which should be used by the 
	 *                      classifier to store the training data
	 */
	public void setTrainingDataStorageMethod(TrainingDataStorageMethod storageMethod)
	{
		this.storageMethod = storageMethod;
	}
	
	/**
	 * <p>Returns the probability calculation method of the naive Bayes 
	 * classifier.</p>
	 * 
	 * @return The probability calculation method of the classifier
	 */
	public ProbabilityCalculation getProbabilityCalculationOfClassifier()
	{
		return this.probCalc;
	}
	
	/**
	 * <p>Specifies the probability calculation method of the naive Bayes 
	 * classifier to be used.</p>
	 * 
	 * @param probCalc The probability calculation method of the classifier to 
	 *                 be used
	 */
	public void setProbabilityCalculationOfClassifier(ProbabilityCalculation probCalc)
	{
		this.probCalc = probCalc;
	}
	
	/**
	 * <p>Tries to predict the text based on either a certain heuristic or
	 * based on some previous training.</p>
	 * @param url The URL of the page whose text should be predicted
	 * @return The predicted article's text
	 * @throws ExtractionException Will be thrown if during the prediction an
	 *                             error occurs
	 */
	public abstract String predictText(String url) throws ExtractionException;
	
	/**
	 * <p>Tries to predict the text for the provided pages based on either a 
	 * certain heuristic or based on some previous training.</p>
	 * 
	 * @param urls The pages whose content should be predicted
	 * @return A list containing all predictions for the provided pages
	 * @throws ExtractionException Will be thrown if during the prediction an
	 *                             error occurs
	 */
	public abstract List<String> predictText(List<String> urls) throws ExtractionException;
	
	/**
	 * <p>Removes unwanted parts of the extracted text</p>
	 * 
	 * @param text Text to remove unwanted parts from
	 * @return The cleaned text
	 */
	public abstract List<Token> cleanText(List<Token> text);
	
	/**
	 * <p>Initializes and starts the training of the classifier</p>
	 */
	public final void initTrainingSamples(int trainingSizePerSource)
	{
		this.trainingSampleSize = trainingSizePerSource;

		// find the directory where the db containing the training-data
		// is located in
		String userDir = System.getProperty("user.dir");
		File trainingDir = new File(userDir+"/trainingData");
		LOG.info("TrainingData Directory: {}", trainingDir);
		if (!trainingDir.isDirectory())
		{
			LOG.error("Could not find training directory located in {}",
					trainingDir);
			return;
		}

		List<String> sources = new ArrayList<>();
		// well known training sources
		sources.add("abcnews.go.com");
		sources.add("cnn.com");
		sources.add("foxnews.com");
		sources.add("latimes.com");
		sources.add("news.bbc.co.uk");
		sources.add("news.com.com");
		sources.add("news.yahoo.com");
		sources.add("nytimes.com");
		sources.add("reuters.com");
		sources.add("usatoday.com");
		sources.add("washingtonpost.com");
		sources.add("wired.com");

		List<TrainingDataStrategy> trainers = TrainerFactory.createTrainer(
				this.trainFrom, trainingDir, sources,
				this.trainingSampleSize, this.trainFeatureStrategy);

		if (null == this.classifier)
		{
			this.classifier =
					NaiveBayes.create(this.probCalc, this.storageMethod);
		}

		LOG.info("Start training");
		long startTime = System.currentTimeMillis();

		for (TrainingDataStrategy trainer : trainers)
		{
			this.classifier = (NaiveBayes<String,String>)trainer.trainModel(this.classifier);
		}
		
		long neededTime = System.currentTimeMillis()-startTime;
		long min = neededTime/1000/60;
		long sec = (neededTime - min*1000*60)/1000;
		LOG.info("Training done. Time needed: {} min {} sec ({} ms)", min, sec, neededTime);
		this.isTrained = true;
	}

	/**
	 * <p>Formats the text in a more human readable form</p>
	 * 
	 * @param text The {@link List} of {@link Token}s which should be formated
	 * @return The formated text
	 */
	protected String formatText(List<Token> text)
	{
		StringBuilder builder = new StringBuilder();
		builder.append("\n");
		boolean blank = false;
		boolean append = true;
		boolean newLine = true;
		Token lastToken = null;
		for (Token t : text)
		{
			// if the last token was a word and this token is a word add a blank before the new token: 'word1 word2'
			if (blank && append && t instanceof Word && !newLine)
				builder.append(" ");
			// if the last token was a tag and it was a closing tag and the new token is a word add a blank: '</a> text'
			// only if the new word is neither a . or :
			if ((append && lastToken instanceof Tag && !((Tag)lastToken).isOpeningTag()) && t instanceof Word && 
					!t.getText().equals(":") && !t.getText().equals(".") && !newLine)
				builder.append(" ");
			// create a blank before a link if the last token was a word: 'word <a href...>'
			if (append && t instanceof Tag && lastToken instanceof Word && ((Tag)t).isOpeningTag() && 
					((Tag)t).getShortTag().equals("a") && !newLine)
				builder.append(" ");
			
			if (t instanceof Tag)
			{
				blank = false;
				Tag tag = (Tag)t;
				// if the text contains <article>...</article> segments only use the part between those tags as content
				if (tag.getShortTag().equals("article") || tag.getShortTag().equals("more"))
				{ 
					append = tag.isOpeningTag();
				}
				// don't show special HTML tags
				if (append && !tag.getShortTag().equals("p") && !tag.getShortTag().equals("cite") && !tag.getShortTag().equals("li") && 
						!tag.getShortTag().equals("strong") && !tag.getShortTag().equals("i") && !tag.getShortTag().equals("b") &&
						!tag.getShortTag().equals("ul") && !tag.getShortTag().equals("span") && !tag.getShortTag().matches("h[1-6]") &&
						!tag.getShortTag().equals("article") && !tag.getShortTag().equals("abbr") && !tag.getShortTag().equals("em"))
				{
					builder.append(t.getHTML());
					newLine = false;
				}
				// insert a new line segment for certain HTML tags
				if (!tag.isOpeningTag() && append && (tag.getShortTag().equals("p") ||tag.getShortTag().matches("h1")))
				{
					builder.append("\n\n");
					newLine = true;
				}
				if (!tag.isOpeningTag() && (tag.getShortTag().matches("h[2-6]") || tag.getShortTag().equals("li") || tag.getShortTag().equals("cite")))
				{
					builder.append("\n");
					newLine = true;
				}
				// insert a blank after a span-tag
				if (!tag.isOpeningTag() && append && (tag.getShortTag().equals("span")) && builder.capacity()>0 && !newLine)
					builder.append(" ");
			}
			else
			{
				if (append)
				{
					if (!t.getText().trim().equals(""))
					{
						builder.append(t.getText());
						newLine = false;
						blank = true;
					}
				}
			}
			lastToken = t;
		}
		
		// TODO: Replace with existing conversion method/library
		// replace special character encodings
		String txt = builder.toString();
		txt = txt.replaceAll("’", "'");
		txt = txt.replaceAll("–", "-");
		txt = txt.replaceAll("—", "-");
		txt = txt.replaceAll("‘", "'");
		txt = txt.replaceAll("’", "'");
		txt = txt.replaceAll(" ", " ");
		txt = txt.replaceAll("“", "\"");
		txt = txt.replaceAll("”", "\"");
		txt = txt.replaceAll("£", "L");
		
		txt = txt.replaceAll("â€“", "-");
		txt = txt.replaceAll("â€œ", "\"");
		txt = txt.replaceAll("â€", "\"");
			
		txt = txt.replaceAll("&quot;", "\"");
		txt = txt.replaceAll("&amp;", "&");
		txt = txt.replaceAll("&nbsp;", " ");
		txt = txt.replaceAll("&rsquo;", "'");
		txt = txt.replaceAll("&mdash;", "-");
		txt = txt.replaceAll("&ldquo;", "\"");
		txt = txt.replaceAll("&rdquo;", "\"");
		
		txt = txt.replaceAll("&#32;", " ");
		txt = txt.replaceAll("&#39;", "'");
		txt = txt.replaceAll("&#160;", " ");
		
		txt = txt.replaceAll("&#039;", "'");	
		txt = txt.replaceAll("&#8217;", "'");
		txt = txt.replaceAll("&#8220;", "\"");
		txt = txt.replaceAll("&#8221;", "\"");
		
		txt = txt.replace("+ -", "+/-");
					
		// remove links and only present text
		txt = txt.replaceAll("<a .*?>(.*?)</a>", "$1");
		txt = txt.replaceAll("</a>", "");
		txt = txt.replaceAll("<a .*?>", "");
		
		txt = txt.replace("<hr>", "");
		
		// sometimes div-tags seem to be cut off inappropriately - delete their
		// garbage
		txt = txt.replaceAll("id=.*?>", "");
		txt = txt.replaceAll("class=.*?>", "");	
		return txt.trim();
	}
}
