package at.rovo.textextraction;

import at.rovo.classifier.naiveBayes.NaiveBayes;
import at.rovo.classifier.naiveBayes.ProbabilityCalculation;
import at.rovo.classifier.naiveBayes.TrainingDataStorageMethod;
import at.rovo.parser.Token;
import at.rovo.textextraction.mss.TrainFeatureStrategy;
import java.io.File;
import java.lang.invoke.MethodHandles;
import java.util.Arrays;
import java.util.Dictionary;
import java.util.Hashtable;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Is the base class for every text extraction algorithm.
 * <p>
 * Text extraction algorithm should have the possibility to predict the text from training examples.
 * <p>
 * Of course there is also the wish to extract the text of an article or web page.
 *
 * @author Roman Vottner
 * @see at.rovo.textextraction.mss.MaximumSubsequenceSegmentation
 */
@SuppressWarnings("unused")
public abstract class TextExtractor
{
    /** The logger of this class **/
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    /** Defines the source where to train the classifier from **/
    protected TrainData trainFrom = TrainData.FILE;
    /** The classifier which needs to be trained **/
    protected NaiveBayes<String, String> classifier = null;
    /** The map-structure containing common tags shared by multiple sources **/
    protected Dictionary<String, List<String>> commonTags = new Hashtable<>();
    /** Indicates if the instance is trained or is in need of training **/
    protected boolean isTrained = false;
    /**
     * Specifies how many tokens should be combined or how many features built from training data examples
     **/
    protected TrainFeatureStrategy trainFeatureStrategy = TrainFeatureStrategy.TRIPLE_UNIGRAM;
    /** Specifies how many samples per sources should be trained **/
    protected int trainingSampleSize = 0;
    /** Specifies in which form data inside the classifier should be stored **/
    protected TrainingDataStorageMethod storageMethod = TrainingDataStorageMethod.MAP;
    /**
     * Specifies the probability calculation of the naive Bayes classifier to be used
     **/
    protected ProbabilityCalculation probCalc = ProbabilityCalculation.EVEN_LIKELIHOOD;

    /**
     * Returns the currently set strategy for training new samples. By default {@link
     * at.rovo.textextraction.mss.TrainFeatureStrategy#TRIPLE_UNIGRAM} is set.
     *
     * @return The currently set strategy for training new samples
     */
    public TrainFeatureStrategy getTrainFeatureStrategy()
    {
        return this.trainFeatureStrategy;
    }

    /**
     * Sets the new strategy for training new samples to the classifier. {@link at.rovo.textextraction.mss.TrainFeatureStrategy#TRIGRAM}
     * will train f.e. 'token1 token2 token3' to the classifier while {@link at.rovo.textextraction.mss.TrainFeatureStrategy#TRIPLE_UNIGRAM}
     * will train 'token1', 'token2', 'token3' as either 'in' or 'out' to the classifier.
     *
     * @param trainFeatureStrategy
     *         The training strategy to be used
     */
    public void setTrainFeatureStrategy(TrainFeatureStrategy trainFeatureStrategy)
    {
        this.trainFeatureStrategy = trainFeatureStrategy;
    }

    /**
     * Returns the storage format of the training data inside the naive Bayes classifier.
     *
     * @return The storage method used by the classifier to store training data
     */
    public TrainingDataStorageMethod getTrainingDataStorageMethod()
    {
        return this.storageMethod;
    }

    /**
     * Defines the format which should be used by the naive Bayes classifier to store the training data.
     *
     * @param storageMethod
     *         The storage method which should be used by the classifier to store the training data
     */
    public void setTrainingDataStorageMethod(TrainingDataStorageMethod storageMethod)
    {
        this.storageMethod = storageMethod;
    }

    /**
     * Returns the probability calculation method of the naive Bayes classifier.
     *
     * @return The probability calculation method of the classifier
     */
    public ProbabilityCalculation getProbabilityCalculationOfClassifier()
    {
        return this.probCalc;
    }

    /**
     * Specifies the probability calculation method of the naive Bayes classifier to be used.
     *
     * @param probCalc
     *         The probability calculation method of the classifier to be used
     */
    public void setProbabilityCalculationOfClassifier(ProbabilityCalculation probCalc)
    {
        this.probCalc = probCalc;
    }

    /**
     * Tries to predict the text based on either a certain heuristic or based on some previous training.
     *
     * @param url
     *         The URL of the page whose text should be predicted
     *
     * @return The predicted article's text
     *
     * @throws ExtractionException
     *         Will be thrown if during the prediction an error occurs
     */
    public abstract String predictText(String url) throws ExtractionException;

    /**
     * Tries to predict the text for the provided pages based on either a certain heuristic or based on some previous
     * training.
     *
     * @param urls
     *         The pages whose content should be predicted
     *
     * @return A list containing all predictions for the provided pages
     *
     * @throws ExtractionException
     *         Will be thrown if during the prediction an error occurs
     */
    public abstract List<String> predictText(List<String> urls) throws ExtractionException;

    /**
     * Removes unwanted parts of the extracted text.
     *
     * @param text
     *         Text to remove unwanted parts from
     *
     * @return The cleaned text
     */
    public abstract List<Token> cleanText(List<Token> text);

    /**
     * Initializes and starts the training of the classifier.
     */
    public final void initTrainingSamples(int trainingSizePerSource)
    {
        this.trainingSampleSize = trainingSizePerSource;

        // find the directory where the db containing the training-data is located in
        String userDir = System.getProperty("user.dir");
        File trainingDir = new File(userDir + "/trainingData");
        LOG.info("TrainingData Directory: {}", trainingDir);
        if (!trainingDir.isDirectory())
        {
            LOG.error("Could not find training directory located in {}", trainingDir);
            return;
        }

        List<String> sources =
                Arrays.asList("abcnews.go.com", "cnn.com", "foxnews.com", "latimes.com", "news.bbc.co.uk",
                              "news.com.com", "news.yahoo.com", "nytimes.com", "reuters.com", "usatoday.com",
                              "washingtonpost.com", "wired.com");

        List<TrainingDataStrategy> trainers = TrainerFactory
                .createTrainer(this.trainFrom, trainingDir, sources, this.trainingSampleSize,
                               this.trainFeatureStrategy);

        if (null == this.classifier)
        {
            this.classifier = NaiveBayes.create(this.probCalc, this.storageMethod);
        }

        LOG.info("Start training");
        long startTime = System.currentTimeMillis();

        for (TrainingDataStrategy trainer : trainers)
        {
            this.classifier = (NaiveBayes<String, String>) trainer.trainModel(this.classifier);
        }

        long neededTime = System.currentTimeMillis() - startTime;
        long min = neededTime / 1000 / 60;
        long sec = (neededTime - min * 1000 * 60) / 1000;
        LOG.info("Training done. Time needed: {} min {} sec ({} ms)", min, sec, neededTime);
        this.isTrained = true;
    }
}
