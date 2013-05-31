package at.rovo.textextraction.mss;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import at.rovo.UrlReader;
import at.rovo.classifier.Classifier;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.textextraction.ExtractionException;
import at.rovo.textextraction.TrainData;

/**
 * <p>This class represents the supervised maximum subsequence 
 * segmentation approach presented by Jeff Pasternack and Dan Roth 
 * in their paper on 'Extracting Article Text from the Web with 
 * Maximum Subsequence Segmentation' to predict the main text 
 * of an article.</p>
 * <p>It therefore uses local naive Bayes classifiers which first
 * have to be trained using the {@link #initTrainingSamples()} 
 * method.</p>
 * <p>The training examples have to either be in a text-file (.txt) 
 * or in a SQLite database (ate.db) inside the trainingData sub-
 * directory of the project-root. Which of both methods of training
 * should be used can be specified by creating a new instance of 
 * this class and providing the appropriate {@link TrainData} 
 * argument.</p>
 * <p>For a text file learning approach, the first line has to 
 * contain the URL of the article, the second line has to contain 
 * the classification of the article (f.e. news). The third line 
 * (till the end of the file) contains the HTML code of the article's 
 * text from the first part (word or tag) till the last word or tag 
 * of the text.</p>
 * <p>The format of the database can be learned 
 * from http://cogcomp.cs.illinois.edu/Data/MSS/</p>
 * <p>After training has completed, main text of articles can be 
 * predicted via {@link #predictText(List)}.</p>
 * <p>It therefore builds a score-list for every local naive Bayes
 * classifier and feeds this list into the maximum subsequence 
 * segmentation algorithm to retrieve a local maximum subsequence.</p>
 * <p>The subsequence which value is highest is taken as predictor for
 * the article text extraction.</p>
 * @author Roman Vottner
 */
public class SupervisedMSS extends MaximumSubsequenceSegmentation
{
	private static Logger logger = LogManager.getLogger(SupervisedMSS.class.getName());
	private Parser parser = null;
	
	/**
	 * <p>Creates a new instance of a supervised maximum subsequence 
	 * segmentation method</p>
	 * 
	 * @param trainForm Defines if training data should be taken from
	 *                  files, the SQLite ate.db or both
	 */
	public SupervisedMSS(TrainData trainForm)
	{
		super(trainForm);
		
		this.parser = new Parser();
		this.parser.cleanFully(true);
	}
	
	/**
	 * <p>Predicts article text based on local classifiers.</p> 
	 * <p>It therefore tries every classifier, out of which it is
	 * calculating a score list from and applies it to the maximum 
	 * subsequence segmentation algorithm to get a local score-value
	 * for the subsequence</p>
	 * <p>The score-list which produces the highest value is taken
	 * as predictor for the article text.</p>
	 * 
	 * @throws NotTrainedException if the instance was not yet trained 
	 * @throws NoSubsequenceFoundException if no subsequence could be found
	 */
	@Override
	public String predictText(final String url) throws ExtractionException
	{
		UrlReader reader = new UrlReader();
		String html = reader.readPage(url);
		if (html == null || html.equals(""))
		{
			if (logger.isErrorEnabled())
				logger.error("No html content available!");
			return null;
		}
//		// extract the source from the url
//		this.setSourceURL(this.extractSourceUrlFromUrl(url));
		
		if (!this.isTrained)
			throw new NotTrainedException("The instance has not yet trained. Please make sure to invoke initTrainingData() beforehand!");
		
		List<Double> maxSS = new ArrayList<Double>();
		String classifierName = null;
		double maxVal = Double.NEGATIVE_INFINITY;
		ParseResult parse = this.parser.tokenize(html, false);
		List<Token> htmlToken = parse.getParsedTokens();
		
		// Build a score-list for the classifier
		List<Double> score = this.buildScoreList(htmlToken, this.classifier);
		int start = this.topMaximumSubsequence(score, maxSS);
		if (maxSS == null || maxSS.size() < 1)
			throw new NoSubsequenceFoundException("No maximum sequence found!");
		maxVal = this.value(maxSS);
		classifierName = this.classifier.getName();
		if (logger.isDebugEnabled())
			logger.debug("Calculating MSS of "+classifierName+": "+maxVal);
		
		// We actually found a subsequence with highest value in one of
		// our classifieres
		if (classifierName != null && logger.isDebugEnabled())
			logger.debug("Using classifier: "+classifierName);
		
		List<Token> predictedContent = this.getPredictedContent(htmlToken, maxSS, start);
		
		if (logger.isInfoEnabled())
		{
			logger.info("title: "+parse.getTitle());
			logger.info("author: "+parse.getAuthors());
			logger.info("date: "+parse.getPublishDate());
			
			logger.info("MSS: "+maxSS);
			logger.info("Predicted Content: "+predictedContent);
		}
		// clean and format the text
		return this.formatText(this.cleanText(predictedContent));
	}
	
	@Override
	public List<String> predictText(final List<String> urls) throws ExtractionException
	{
		List<String> predictedContent = new ArrayList<String>();
		for (String url : urls)
			predictedContent.add(this.predictText(url));
		return predictedContent;
	}
	
	/**
	 * <p>Extracts the source URL from the origin URL</p>
	 * 
	 * @param url The origin URL
	 * @return The source URL
	 */
	protected String extractSourceUrlFromUrl(String url)
	{
		url = url.replace("http://", "");
		url = url.substring(0, url.indexOf("/"));
		if (url.startsWith("www."))
			url = url.replace("www.", "");
		return url;
	}
	
	/**
	 * <p>Extracts the predicted article content from the HTML page</p>
	 * 
	 * @param html A {@link List} containing all {@link Token}s of the origin page
	 * @param maxSS The predicted result of the maximum subsequence segmentation algorithm
	 * @param start The start position based on the prediction of the MSS algorithm
	 * @return The predicted text as a {@link List} of {@link Token}s
	 */
	protected List<Token> getPredictedContent(List<Token> html, List<Double> maxSS, int start)
	{
		List<Token> text = new ArrayList<Token>();
		if (start+maxSS.size()+1 <= html.size())
			for (int j=start; maxSS != null && j<=start+maxSS.size()+1; j++)
				text.add(html.get(j));
		else
			for (int j=start; maxSS != null && j<=start+maxSS.size(); j++)
				text.add(html.get(j));
		return text;
	}
	
	/**
	 * <p>Builds a score-list based on the probabilities of the local classifier for
	 * every token to be labeled as in - 0.5 to generate values between -0.5 and 0.5</p>
	 * 
	 * @param html {@link List} of {@link Token}s which represent the HTML page whose
	 *             main article text should be predicted
	 * @param bayes The local classifier used
	 * @return A {@link List} of scores  
	 */
	protected List<Double> buildScoreList(List<Token> html, Classifier<String, String> classifier)
	{
		List<Double> scoreList = new ArrayList<Double>();
		if (logger.isDebugEnabled())
			logger.debug("Score-List:");
		int start = 0;
		if (TrainingStrategy.BIGRAM.equals(this.trainingStrategy) || TrainingStrategy.DOUBLE_UNIGRAM.equals(this.trainingStrategy))
			start = 1;
		else if (TrainingStrategy.TRIGRAM.equals(this.trainingStrategy) || TrainingStrategy.TRIPLE_UNIGRAM.equals(this.trainingStrategy))
			start = 2;
		
		Token token1 = null;
		Token token2 = null;
		for (int i=0; i<html.size(); i++)
		{
			Token token = html.get(i);
			double score = 0.;
			// build an n-gram for the token and look up the probability for this
			// n-gram
			if (i >= start)
			{
				if (this.trainingStrategy.equals(TrainingStrategy.TRIGRAM))
//					score = classifier.getProbability("in", this.getTrigram(token1, token2, token))-0.5;
					score = classifier.getProbability_EvenLikelihood("in", this.getTrigram(token1, token2, token))-0.5;
//					score = classifier.getSmoothedProbability("in", this.getTrigram(token1, token2, token), 1.)-0.5;
//					score = classifier.getWeightedProbability("in", this.getTrigram(token1, token2, token))-0.5;
				else if (this.trainingStrategy.equals(TrainingStrategy.BIGRAM))
//					score = classifier.getProbability("in", this.getBigram(token2, token))-0.5;
					score = classifier.getProbability_EvenLikelihood("in", this.getBigram(token2, token))-0.5;
//					score = classifier.getSmoothedProbability("in", this.getBigram(token2, token),1.)-0.5;
//					score = classifier.getWeightedProbability("in", this.getBigram(token2, token))-0.5;
				else if (this.trainingStrategy.equals(TrainingStrategy.UNIGRAM))
					score = classifier.getWeightedProbability("in", this.getUnigram(token))-0.5;
				else if (this.trainingStrategy.equals(TrainingStrategy.DOUBLE_UNIGRAM))
					score = classifier.getWeightedProbability("in", this.getDoubleUnigram(token2, token))-0.5;
				else if (this.trainingStrategy.equals(TrainingStrategy.TRIPLE_UNIGRAM))
					score = classifier.getWeightedProbability("in", this.getTripleUnigram(token1, token2, token))-0.5;
				
				if (logger.isDebugEnabled())
					logger.debug((score < 0 ? "": " ")+new DecimalFormat("#0.000").format(score)+" : "+token.getText());
				scoreList.add(score);
			}
			token1 = token2;
			token2 = token;
		}
		return scoreList;
	}
	
	/**
	 * <p>Builds a triple unigram out of three tokens</p>
	 * 
	 * @param t1 First token of a triple unigram
	 * @param t2 Second token of a triple unigram
	 * @param t3 Third token of a triple unigram
	 * @return The triple unigram of the provided tokens
	 */
	protected String[] getTripleUnigram(Token t1, Token t2, Token t3)
	{
		String[] unigram = new String[3];
		if (t1 instanceof Word)
			unigram[0] = Parser.formatText(t1.getText());
		else
			unigram[0] = t1.getText();
		
		if (t2 instanceof Word)
			unigram[1] = Parser.formatText(t2.getText());
		else
			unigram[1] = t2.getText();
		
		if (t3 instanceof Word)
			unigram[2] = Parser.formatText(t3.getText());
		else
			unigram[2] = t3.getText();
		
		if (logger.isDebugEnabled())
			logger.debug("Triple-Unigramm: "+unigram);
		return unigram;
	}
	
	/**
	 * <p>Builds a double unigram out of two tokens</p>
	 * 
	 * @param t1 First token of a double unigram
	 * @param t2 Second token of a double unigram
	 * @return The double unigram of the provided tokens
	 */
	protected String[] getDoubleUnigram(Token t1, Token t2)
	{
		String[] unigram = new String[2];
		if (t1 instanceof Word)
			unigram[0] = Parser.formatText(t1.getText());
		else
			unigram[0] = t1.getText();
		
		if (t2 instanceof Word)
			unigram[1] = Parser.formatText(t2.getText());
		else
			unigram[1] = t2.getText();
		
		if (logger.isDebugEnabled())
			logger.debug("Double-Unigramm: "+unigram);
		return unigram;
	}

	/**
	 * <p>Build a unigram out of a token</p>
	 * @param t1
	 * @return
	 */
	protected String getUnigram(Token t1)
	{
		String unigram = null;
		if (t1 instanceof Word)
			unigram = Parser.formatText(t1.getText());
		else
			unigram = t1.getText();
		
		if (logger.isDebugEnabled())
			logger.debug("Unigramm: "+unigram);
		return unigram;
	}
	
	/**
	 * <p>Builds a bigram out of two tokens</p>
	 * 
	 * @param t1 First token of a bigram
	 * @param t2 Second token of a bigram
	 * @return The bigram of the provided tokens
	 */
	protected String getBigram(Token t1, Token t2)
	{
		String bigram = null;
		if (t1 instanceof Word)
			bigram = Parser.formatText(t1.getText());
		else
			bigram = t1.getText();
		
		if (t2 instanceof Word)
			bigram += " " + Parser.formatText(t2.getText());
		else
			bigram += " " + t2.getText();
		
		if (logger.isDebugEnabled())
			logger.debug("Bigramm: "+bigram);
		return bigram;
	}
	
	/**
	 * <p>Builds a trigram out of three tokens</p>
	 * 
	 * @param t1 First token of a trigram
	 * @param t2 Second token of a trigram
	 * @param t3 Third token of a trigram
	 * @return The trigram of the provided tokens
	 */
	protected String getTrigram(Token t1, Token t2, Token t3)
	{
		String trigram = null;
		if (t1 instanceof Word)
			trigram = Parser.formatText(t1.getText());
		else
			trigram = t1.getText();
		
		if (t2 instanceof Word)
			trigram += " " + Parser.formatText(t2.getText());
		else
			trigram += " " + t2.getText();
		
		if (t3 instanceof Word)
			trigram += " " + Parser.formatText(t3.getText());
		else
			trigram += " " + t3.getText();
		
		if (logger.isDebugEnabled())
			logger.debug("Trigramm: "+trigram);
		return trigram;
	}
}
