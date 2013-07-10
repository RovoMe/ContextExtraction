package at.rovo.textextraction.mss;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import at.rovo.common.UrlReader;
import at.rovo.classifier.Classifier;
import at.rovo.classifier.naiveBayes.NaiveBayes;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.Token;
import at.rovo.textextraction.ExtractionException;
import at.rovo.textextraction.TrainData;

/**
 * <p>
 * This class represents the semi supervised maximum subsequence segmentation
 * approach presented by Jeff Pasternack and Dan Roth in their paper on
 * 'Extracting Article Text from the Web with Maximum Subsequence Segmentation'
 * to predict the main text of an article.
 * </p>
 * <p>
 * On predicting the main content either via {@link #predictText(String)} or
 * {@link #predictText(List)}, the semi supervised approach first uses the same
 * approach as {@link SupervisedMSS} to get a base extraction for every URL
 * passed.
 * </p>
 * <p>
 * After the content of all URLs got predicted initially, a correctness-value
 * for the prediction is calculated. This correctness prediction estimation is
 * then compared with a threshold value, which in the current implementation is
 * 0.95. If the predicted text exceeds this threshold the prediction is used as
 * training sample for a new classifier. While {@link #predictText(String)}
 * creates a new classifier for every URL passed, {@link #predictText(List)}
 * creates only a single classifier per iteration for all URLs passed. This may
 * therefore lead to a decrease of accuracy for predicted articles.
 * </p>
 * <p>
 * The new classifier is then used to predict the new main content of the
 * article. For the prediction probabilities for nGrams are taken from a naive
 * Bayes classifier. Although NB classifier are not that accurate they are easy
 * to implement and work well enough on texts. The probabilities are used to
 * create a score for each nGram where the last {@link Token} of a nGram is the
 * key token for this feature. Therefore each probability is multiplied with a
 * calculated importance weighting function for a set of nGrams where the last
 * element of the nGram is the key for this nGram. I.e. the last sentence has a
 * bigram 'set of' and 'element of' which are combined in the same set of a
 * nGram.
 * </p>
 * <p>
 * The weight importance calculation now considers the position of each nGram
 * within the origin document and adds a boost to the probability for nGrams
 * near the border of the predicted text. With {@link #setWindowRadius(int)} a
 * certain fall-off for the probability boost at the prediction's border can be
 * set. Enlarging the value, which by default is 10 tokens, results in more
 * tokens to the left and right of each border boosting the probability of these
 * tokens.
 * </p>
 * <p>
 * The generated score list is now used to feed the
 * {@link MaximumSubsequenceSegmentation} algorithm and predict the actual
 * content which is further cleaned from unneeded HTML-tokens and formated to be
 * read more user friendly.
 * </p>
 * 
 * @author Roman Vottner
 */
public class SemiSupervisedMSS extends SupervisedMSS
{
	/** The logger of this instance **/
	private static Logger logger = LogManager.getLogger(SemiSupervisedMSS.class);
	/** The maximum number of semi supervised training and prediction iterations **/
	private static int MAX_ITERATIONS = 10;
	/**
	 * The window radius will boost the likelihood of n tokens to the left and
	 * right of the prediction border
	 **/
	private int windowRadius = 10;

	/** distance cutoff **/
	private final double d = 64.;
	/** multiplier for the importance weighting **/
	private final double c = 24.;
	/** The parser used to download the content from pages on the Internet **/
	private Parser parser = null;

	/**
	 * <p>
	 * Creates a new instance of a semi supervised maximum subsequence
	 * segmentation extraction algorithm which predicts the main article of a
	 * news related web site.
	 * </p>
	 * 
	 * @param trainForm
	 *            The training data which should be used by the naive Bayes
	 *            classifier
	 */
	public SemiSupervisedMSS(TrainData trainForm)
	{
		super(trainForm);

		this.parser = new Parser();
		this.parser.cleanAnchors();
	}

	/**
	 * <p>
	 * To prevent that {@link Token}s far away from the boundaries of the
	 * article text are weighted equally with those closer a window radius may
	 * be specified to emphasize {@link Token}s near the boundaries.
	 * </p>
	 * <p>
	 * By default the window radius is set to 10 {@link Token}s
	 * </p>
	 * 
	 * @param windowRadius
	 *            The new window radius
	 */
	public void setWindowRadius(int windowRadius)
	{
		this.windowRadius = windowRadius;
	}

	/**
	 * <p>
	 * Returns the window radius which represents an area around the content of
	 * an article where {@link Token}s near the boundary are declared to be more
	 * important than on the border.
	 * </p>
	 * 
	 * @return The currently defined window radius. By default this is set to 10
	 */
	public int getWindowRadius()
	{
		return this.windowRadius;
	}

	/**
	 * <p>
	 * Predicts article text based on local classifiers.
	 * </p>
	 * <p>
	 * It therefore tries every classifier, out of which it is calculating a
	 * score list from and applies it to the maximum subsequence segmentation
	 * algorithm to get a local score-value for the subsequence
	 * </p>
	 * <p>
	 * The score-list which produces the highest value is taken as predictor for
	 * the article text.
	 * </p>
	 * 
	 * @return The predicted main content of a news article
	 * @throws ExtractionException
	 *         if the URL to predict content from is either null or empty
	 * @throws NotTrainedException
	 *         if the instance was not yet trained
	 * @throws NoSubsequenceFoundException
	 *         if no subsequence could be found
	 */
	@Override
	public String predictText(final String url) throws ExtractionException
	{
		UrlReader reader = new UrlReader();
		String html = reader.readPage(url);
		if (html == null || html.equals(""))
		{
			logger.error("No html content available!");
			throw new ExtractionException(
					"Page to predict content from is either null or empty");
		}

		if (!this.isTrained)
			throw new NotTrainedException("The instance has not yet trained. "
					+ "Please make sure to invoke initTrainingData() beforehand!");

		// 1. 1. Train a Naive Bayes local classifier on the provided labeled
		// training examples
		// with trigram and most-recent-unclosed-tag features, as in the
		// supervised approach
		// is already done by the parent class
		// 2. Predict extractions for the unlabeled documents U
		ParseResult parse = this.parser.tokenize(html, false);
		List<Token> htmlToken = parse.getParsedTokens();
		List<Double> score = this.buildScoreList(htmlToken, this.classifier);
		List<Double> maxSS = new ArrayList<Double>();
		int start = this.topMaximumSubsequence(score, maxSS);
		List<Token> L = htmlToken;
		List<Token> predictedText = this.getPredictedContent(htmlToken, maxSS, start);
		logger.trace("Predicting content of {}", url);
		logger.trace("predicted Text: \n{}", this.formatText(predictedText));
		// 3. Iterate:
		for (int i = 0; i < MAX_ITERATIONS; i++)
		{
			// a. Choose a portion of the documents in U with the seemingly most
			//    likely correct predicted extractions, and call these L.
			double v = this.estimatePredictionCorrectness(htmlToken, start, start + maxSS.size());
			if (v > 0.95)
				L = htmlToken;

			// b. Find "importance weights" for the trigram of the documents in
			//    L.
			// are incorporated in the scoring function

			// c. Train a new Naive Bayes local classifier over the documents in
			//    L with trigram features.
			NaiveBayes<String, String> localClassifier = NaiveBayes.create(
					this.probCalc,	this.storageMethod);
			this.train(L, predictedText, url, localClassifier);

			// d. Predict new extractions for the documents in U.
			score = this.buildScoreList(L, localClassifier);
			start = this.topMaximumSubsequence(score, maxSS);
			predictedText = this.getPredictedContent(L, maxSS, start);
			logger.debug("predicted Text: \n{}",predictedText);
//			logger.debug("predicted Text: \n{}",this.formatText(predictedText));
		}
		return this.formatText(this.cleanText(predictedText));
	}

	@Override
	public List<String> predictText(final List<String> urls)
			throws ExtractionException
	{
		if (!this.isTrained)
			throw new NotTrainedException("The instance has not yet trained. "
					+ "Please make sure to invoke initTrainingData() beforehand!");

		List<List<Token>> htmlTokens = new ArrayList<List<Token>>();
		List<Integer> startPos = new ArrayList<Integer>();
		List<List<Double>> maxSSs = new ArrayList<List<Double>>();
		List<List<Token>> predictedTexts = new ArrayList<List<Token>>();
		List<Double> vs = new ArrayList<Double>();

		List<Double> score = null;
		List<Double> maxSS = null;
		List<Token> predictedText = null;

		for (String url : urls)
		{
			UrlReader reader = new UrlReader();
			String html = reader.readPage(url);
			if (html == null || html.equals(""))
			{
				logger.error("No html content available for {}!", url);
				continue;
			}

			// 1. Training of the Naive Bayes classifier is already done by the
			// parent class
			// 2. Predict extractions for the unlabeled documents U
			ParseResult parse = this.parser.tokenize(html, false);
			List<Token> htmlToken = parse.getParsedTokens();
			htmlTokens.add(htmlToken);
			score = this.buildScoreList(htmlToken, this.classifier);
			maxSS = new ArrayList<Double>();

			int start = this.topMaximumSubsequence(score, maxSS);
			maxSSs.add(maxSS);
			startPos.add(start);

			logger.trace("Predicting content of {}", url);
			predictedText = this.getPredictedContent(htmlToken, maxSS, start);
			predictedTexts.add(predictedText);

			logger.debug("predicted Text: \n{}", predictedText);
//			logger.debug("predicted Text: \n{}", this.formatText(this.cleanText(predictedText)));
		}

		// Classifier<String, String> localClassifier = NaiveBayes.create(
		// this.probCalc, this.storageMethod);
		// 3. Iterate
		for (int i = 0; i < MAX_ITERATIONS; i++)
		{

			// a. Choose a portion of the documents in U with the seemingly most
			//    likely correct predicted extractions, and call these L.
			Map<Integer, List<Token>> L = new HashMap<Integer, List<Token>>();
			for (int j = 0; j < htmlTokens.size(); j++)
			{
				double v = this.estimatePredictionCorrectness(
						htmlTokens.get(j), startPos.get(j), startPos.get(j)
								+ maxSSs.get(j).size());
				logger.trace("start: {}; length: {}; end: {}; v: {}", 
						startPos.get(j), maxSSs.get(j).size(), 
						(startPos.get(j) + maxSSs.get(j).size()), v);

				if (vs.size() < htmlTokens.size())
				{
					L.put(j, htmlTokens.get(j));
					vs.add(v);
					// localClassifier = NaiveBayes.create(this.probCalc, 
					//		this.storageMethod);
				}
				else if (v > 0.95)// vs.get(j))
				{
					L.put(j, htmlTokens.get(j));
					vs.set(j, v);
					// localClassifier = NaiveBayes.create(this.probCalc, 
					//		this.storageMethod);
				}
				else
					L.put(j, null);
			}
			// b. Find "importance weights" for the trigrams of the documents in
			//    L.
			// are incorporated in the scoring function

			// c. Train a new Naive Bayes local classifier over the documents in
			//    L with trigram features.
			NaiveBayes<String, String> localClassifier = NaiveBayes.create(
					this.probCalc, this.storageMethod);
			for (int j = 0; j < L.size(); j++)
			{
				if (L.get(j) != null)
					this.train(L.get(j), predictedTexts.get(j), urls.get(j),
							localClassifier);
			}
			logger.trace("");

			// d. Predict new extractions for the documents in U
			for (int j = 0; j < L.size(); j++)
			{
				if (L.get(j) != null)
				{
					score = this.buildScoreList(L.get(j), localClassifier,
							startPos.get(j), startPos.get(j)
									+ maxSSs.get(j).size() - 1);

					logger.trace("Predicting content of {}", urls.get(j));
					logger.trace("predicted score: {}", score);
					
					int start = this.topMaximumSubsequence(score, maxSS);
					startPos.set(j, start);
					maxSSs.set(j, maxSS);
					predictedText = this.getPredictedContent(L.get(j), maxSS,
							start);
					predictedTexts.set(j, predictedText);
					
					logger.debug("predicted Text: \n{}", predictedText);
//					logger.debug("predicted Text: \n{}", this.formatText(this.cleanText(predictedText)));
				}
			}
		}
		List<String> contentOfPages = new ArrayList<String>();
		for (List<Token> tokens : predictedTexts)
			contentOfPages.add(this.formatText(this.cleanText(tokens)));
		return contentOfPages;
	}

	/**
	 * <p>
	 * Trains a local classifier with a new article
	 * <p>
	 * 
	 * @param html
	 *            The origin HTML page as a {@link List} of {@link Token}s
	 * @param predictedText
	 *            The predicted text for the HTML page as a {@link List} of
	 *            {@link Token}s
	 * @param url
	 *            The URL of the origin HTML page. This is only used for
	 *            debugging purposes
	 * @param classifier
	 *            The classifier to be used for training
	 */
	protected void train(List<Token> html, List<Token> predictedText,
			String url, Classifier<String, String> classifier)
	{
		TrainingEntry entry = new TrainingEntry(html, predictedText,
				classifier, false);
		entry.setTrainingStrategy(this.trainingStrategy);
		entry.setSourceUrl(this.extractSourceUrlFromUrl(url));
		entry.setUrl(url);
		entry.setCommonTags(this.commonTags);
		entry.train(false);
	}

	/**
	 * <p>
	 * Calculates the correctness of the predicted text
	 * </p>
	 * 
	 * @param html
	 *            All Tokens of the
	 * @param j
	 *            The index of the first token of the predicted text
	 * @param k
	 *            The index of the last token of the predicted text
	 * @return The likelihood of the correctness of the text prediction
	 * @throws IllegalArgumentException
	 *             If html is null or empty
	 * @throws IllegalArgumentException
	 *             If j < 0 or j >= html.size()
	 * @throws IllegalArgumentException
	 *             If k < 0 or k >= html.size()
	 * @throws IllegalArgumentException
	 *             If j >= k
	 */
	protected double estimatePredictionCorrectness(List<Token> html, int j,
			int k)
	{
		if (html == null || html.isEmpty())
			throw new IllegalArgumentException("No list of tokens representing "
					+ "the origin page provided!");
		if (j < 0 || j >= html.size())
			throw new IllegalArgumentException("The index of the predicted first"
					+ " token is not inside the origin list of tokens!");
		if (k < 0 || k >= html.size() || k - this.windowRadius < 0)
			throw new IllegalArgumentException("The index of the predicted last "
					+ "token is not inside the origin's list of tokens!");
		if (j >= k)
			throw new IllegalArgumentException("The start of the predicted text "
					+ "cannot be after the end or at the same position!");

		// pi = probability given by the Naive Bayes predictor that a token is
		// "in"
		// j is the index of the first token
		// k is the index of the last token
		// n = total number of tokens in the document
		int n = html.size();
		double prob1 = 1.;
		double prob2 = 1.;
		double prob3 = 1.;
		double prob4 = 1.;

		// Check if we start the calculations with the first token if j is any
		// number
		// less than the window radius
		int start = j - this.windowRadius;
		if (start < 0)
			start = 0;
		for (int i = start; i < j; i++)
		{
			if (html.get(i).getText() != null)
				prob1 *= (1 - this.classifier.getProbability("in", html.get(i).getText()));
			else
				prob1 *= (1 - this.classifier.getProbability("in", html.get(i).getHTML()));
		}
		for (int i = j; i <= j + this.windowRadius - 1; i++)
		{
			if (html.get(i).getText() != null)
				prob2 *= this.classifier.getProbability("in", html.get(i).getText());
			else
				prob2 *= this.classifier.getProbability("in", html.get(i).getHTML());
		}
		for (int i = k - this.windowRadius + 1; i <= k; i++)
		{
			if (html.get(i).getText() != null)
				prob3 *= this.classifier.getProbability("in", html.get(i).getText());
			else
				prob3 *= this.classifier.getProbability("in", html.get(i).getHTML());
		}
		// Check that we do not read more tokens than are available
		int end = k + this.windowRadius;
		if (end > n)
			end = n;
		for (int i = k + 1; i < end; i++)
		{
			if (html.get(i).getText() != null)
				prob4 *= (1 - this.classifier.getProbability("in", html.get(i).getText()));
			else
				prob4 *= (1 - this.classifier.getProbability("in", html.get(i).getHTML()));
		}

		double v = Math.pow((prob1 * prob2 * prob3 * prob4), (1. / n));
		logger.trace("Estimated corectness: {}", v);
		return v;
	}

	/**
	 * <p>
	 * Calculates the importance weights for a trigram
	 * </p>
	 * 
	 * @param Th
	 *            The set of all tokens with trigram h
	 * @param j
	 *            The index of the first token in the article text
	 * @param k
	 *            The index of the last token in the article text
	 * @return The importance weight of trigram h
	 */
	protected double calculateImportanceWeighting(Set<List<Token>> Th, int j,
			int k)
	{
		// Th is the set of all tokens with trigram h
		// j is the index of the first token in the article text
		// k is the index of the last token in the article text
		double mh = 0.;
		for (List<Token> t : Th)
			mh += (this.d - Math.min(this.d, Math.min(Math.abs(this.index(t)
					- (j - 0.5)), Math.abs(this.index(t) - (k + 0.5)) - 0.5)))
					/ (this.d);

		return mh;
	}

	/**
	 * <p>
	 * Builds a score-list based on the probabilities of the local classifier
	 * for every token to be labeled as in - 0.5 to generate values between -0.5
	 * and 0.5
	 * </p>
	 * 
	 * @param html
	 *            {@link List} of {@link Token}s which represent the HTML page
	 *            whose main article text should be predicted
	 * @param bayes
	 *            The local classifier used
	 * @param j
	 *            The index of the first token in the article text from previous
	 *            predictions
	 * @param k
	 *            The index of the last token in the article text from previous
	 *            predictions
	 * @return A {@link List} of scores
	 */
	protected List<Double> buildScoreList(List<Token> html,
			NaiveBayes<String, String> classifier, int j, int k)
	{
		List<Double> scoreList = new ArrayList<Double>();
		logger.trace("Score-List:");
		for (int i = 2; i < html.size(); i++)
		{
			// prepare and build the trigrams
			Token token1 = html.get(i - 2);
			Token token2 = html.get(i - 1);
			Token token3 = html.get(i);

			double score = 0.;
			Set<List<Token>> featureSet = this.buildFeatureSet(html, token3);

			if (this.trainingStrategy.equals(TrainingStrategy.TRIGRAM))
			{
				logger.trace("pi: {}", classifier.getProbability("in", this.getTrigram(token1, token2, token3)));
				logger.trace("mh: {}", this.calculateImportanceWeighting(featureSet, j, k));
				score = (classifier.getProbability("in", this.getTrigram(token1, token2, token3)) - 0.5)
						* (this.calculateImportanceWeighting(featureSet, j, k) * this.c + 1.);
			}
			else if (this.trainingStrategy.equals(TrainingStrategy.BIGRAM))
			{
				logger.trace("pi: {}", classifier.getProbability("in", this.getBigram(token2, token3)));
				logger.trace("mh: {}", this.calculateImportanceWeighting(featureSet, j, k));
				score = (classifier.getProbability("in", this.getBigram(token2,	token3)) - 0.5)
						* (this.calculateImportanceWeighting(featureSet, j, k) * this.c + 1.);
			}
			else if (this.trainingStrategy.equals(TrainingStrategy.UNIGRAM))
			{
				logger.trace("pi: {}", classifier.getProbability("in", this.getUnigram(token3)));
				logger.trace("mh: {}", this.calculateImportanceWeighting(featureSet, j, k));
				score = (classifier.getProbability("in", this.getUnigram(token3)) - 0.5)
						* (this.calculateImportanceWeighting(featureSet, j, k) * this.c + 1.);
			}
			else if (this.trainingStrategy.equals(TrainingStrategy.DOUBLE_UNIGRAM))
			{
				logger.trace("pi: {}", classifier.getProbability("in", this.getDoubleUnigram(token2, token3)));
				logger.trace("mh: {}", this.calculateImportanceWeighting(featureSet, j, k));
				score = (classifier.getProbability("in", this.getDoubleUnigram(token2, token3)) - 0.5)
						* (this.calculateImportanceWeighting(featureSet, j, k) * this.c + 1.);
			}
			else if (this.trainingStrategy.equals(TrainingStrategy.TRIPLE_UNIGRAM))
			{
				logger.trace("pi: {}", classifier.getProbability("in", this.getTripleUnigram(token1, token2, token3)));
				logger.trace("mh: {}", this.calculateImportanceWeighting(featureSet, j, k));
				score = (classifier.getProbability("in", this.getTripleUnigram(token1, token2, token3)) - 0.5)
						* (this.calculateImportanceWeighting(featureSet, j, k) * this.c + 1.);
			}

			logger.trace("{} : {}", new DecimalFormat("#0.000").format(score),
					(token3.getText() != null ? token3.getText() : token3.getHTML()));
			scoreList.add(score);
		}
		return scoreList;
	}

	/**
	 * <p>
	 * Builds a set of unique tri-/bi-/unigrams based on the last token. As a
	 * nGram is only a 'feature' of a token, a single token can have multiple
	 * nGrams inside a certain text. For example in the above sencence 'token'
	 * builds two trigrams: 'of a token' and 'a single token'.
	 * </p>
	 * <p>
	 * Note that the key-token for a nGram is always the last token.
	 * </p>
	 * 
	 * @param html
	 *            A list containing every token of a page
	 * @param token
	 *            The token the set of unique nGram should be build for.
	 * @return The set containing only unique nGrams for a single token
	 */
	protected Set<List<Token>> buildFeatureSet(List<Token> html, Token token)
	{
		Set<List<Token>> nGrams = new LinkedHashSet<List<Token>>();
		for (int i = 2; i < html.size(); i++)
		{
			Token token1 = html.get(i - 2);
			Token token2 = html.get(i - 1);
			Token token3 = html.get(i);
			token3.setIndex(i);
			if (token3.getText() != null)
			{
				if ((token3.getText() != null && token3.getText().equals(
						token.getText()))
						|| token3.getHTML() != null
						&& token3.getHTML().equals(token.getHTML()))
				{
					List<Token> nGram = new ArrayList<Token>();
					if (this.trainingStrategy.equals(TrainingStrategy.TRIGRAM))
						nGram.add(token1);
					if (this.trainingStrategy.equals(TrainingStrategy.TRIGRAM)
							|| this.trainingStrategy.equals(TrainingStrategy.BIGRAM))
						nGram.add(token2);
					nGram.add(token3);
					nGrams.add(nGram);
				}
			}
		}
		return nGrams;
	}

	/**
	 * <p>
	 * nGrams can appear in a text multiple times, therefore this method returns
	 * the index of the nGrams 'key-token', which is the last token of the
	 * nGram, according to the position of the nGram within the full HTML
	 * document.
	 * </p>
	 * 
	 * @param nGram
	 *            A nGram whose position in the origin HTML document should be
	 *            returned.
	 * @return The position of the nGrams in the HTML document
	 */
	protected int index(List<Token> nGram)
	{
		// Based on an email from Jeff Pasternack: "index(t), this occurs in a
		// summation;
		// it's the index of each token with the given trigram (not just the
		// first)"
		return nGram.get(nGram.size() - 1).getIndex();
	}
}
