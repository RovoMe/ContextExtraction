package at.rovo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import at.rovo.textextraction.ExtractionException;
import at.rovo.textextraction.TextExtractor;
import at.rovo.textextraction.TrainData;
import at.rovo.textextraction.mss.*;

/**
 * <p>
 * The entrance to the application. A couple of parameters are required to
 * select for example the training method or the source of training. These
 * arguments can be either passed as console-arguments to the application or as
 * parameter to the constructor.
 * </p>
 * <p>
 * Required arguments or parameters are:
 * </p>
 * <ul>
 * <li>extractionMethod - defines the extraction algorithm used for text
 * prediction.
 * <ul>
 * <li>simple - {@link SimpleMSS}</li>
 * <li>supervised - {@link SupervisedMSS}</li>
 * <li>semiSupervised - {@link SemiSupervisedMSS}</li>
 * </ul>
 * </li>
 * <li>trainingStrategy - specifies how features for the training of the
 * classifier should be used. This can either be
 * <ul>
 * <li>TRIGRAM</li>
 * <li>BIGRAM</li>
 * <li>UNIGRAM</li>
 * <li>DOUBLE_UNIGRAM</li>
 * <li>TRIPLE_UNIGRAM</li>
 * </ul>
 * </li>
 * <li>trainingSource - specifies where samples can be found for the training.
 * This can either be
 * <ul>
 * <li>FILE - a txt file containing the URL on the first line, the
 * classification of the page in the second line and the content as plain text
 * including HTML tags in consecutive lines</li>
 * <li>DB - the 'ate.db' SQLite database used and maintained by Jeff Pasternack
 * and Dan Roth (http://cogcomp.cs.illinois.edu/Data/MSS/)</li>
 * <li>BOTH - both previous listed methods are used for training the classifier</li>
 * </ul>
 * Note: all sample files need to be located in the trainingData sub directory
 * of the project root</li>
 * <li>trainingSizePerSource - the number of samples used within the 'ate.db'
 * SQLite DB per news provider</li>
 * </ul>
 * <p>
 * The constructor of this class will use the above parameters to either train a
 * new classifier or reuse a previously trained one. After a classifier was
 * trained successfully the training data is serialized to disk for later usage.
 * </p>
 * <p>
 * It will reuse an already trained classifier only if the 'trainingData'
 * sub-directory contains a classifier whose name includes the
 * <em>trainingStrategy</em> and the <em>trainingSizePerSource</em> argument.
 * For example on the first run, without any pre-existing classifier, a training
 * of 5000 samples per source and a BIGRAM strategy the serialized object that
 * contains all trained features will be named
 * mssClassificationData_5000_BIGRAM.ser. If on consecutive runs both,
 * trainingStrategy and trainingSizePerSource, match these values the data of
 * the classifier is reused and therefore training process is skipped.
 * </p>
 * <p>
 * Once training has completed or an already trained classifier was loaded
 * content can either be extracted automatically via an 'extract=URL' argument
 * passed to application invocation, where URL is the URL address to the web
 * page, or via invoking {@link #predictContent(String)} or
 * {@link #predictContent(List)}.
 * </p>
 * <p>
 * In case of semi-supervised extraction the primer one only trains a single
 * classifier for a URL while the latter one builds a common classifier for all
 * provided URLs. This might have a negative influence on the accuracy of the
 * prediction for a single URL compared to the primer method.
 * </p>
 * 
 * @author Roman Vottner
 */
public class Main 
{
	private static Logger logger = LogManager.getLogger(Main.class);
	
	/** The text extraction implementation to use for main content prediction **/
	private TextExtractor te = null;
	
	/**
	 * <p>
	 * Creates a new instance of the application. Provided arguments are used to
	 * either train a new general classifier for news related web sites or
	 * reload an already trained classifier in relation to the training strategy
	 * and sample size used for the training.
	 * </p>
	 * <p>
	 * Training or loading a previously trained classifier will automatically be
	 * invoked so that on return of the constructor the application is ready to
	 * classify and extract content.
	 * </p>
	 * 
	 * @param extractionMethod
	 *            The method used for extracting the content. This can either be
	 *            'simple', 'supervised' or 'semiSupervised'
	 * @param trainingStrategy
	 *            The training strategy used. This may be one of the following
	 *            settings: 'TRIGRAM', 'BIGRAM', 'UNIGRAM', 'DOUBLE_UNIGRAM' or
	 *            'TRIPPLE_UNIGRAM'
	 * @param trainSource
	 *            The training source which should be used. This can either be
	 *            'FILE', 'DB' or 'BOTH'. First will load txt-files that contain
	 *            the URL on the first line, the classification of the example
	 *            on the second line and the main-content including HTML-tags on
	 *            the remaining lines. DB will load
	 *            <em>trainingSizePerSource</em> samples for each stored news
	 *            provider from the 'ate.db' SQLite DB while BOTH will train the
	 *            classifier from both sources. Note that all sample files and
	 *            the DB have to be in the trainingData sub-directory of the
	 *            project root.
	 * @param trainingSizePerSource
	 *            The number of samples per news provider stored in the SQLite
	 *            DBthat should be used to train the classifier.
	 */
	public Main(String extractionMethod, TrainingStrategy trainingStrategy, TrainData trainSource, int trainingSizePerSource)
	{
		// Check if SQLite4java path is set
		if (System.getProperty("sqlite4java.library.path") == null)
		{
			logger.error("SQLite4java Path is not set!");
			throw new IllegalArgumentException("SQLite4java Path is not set!");
		}
		
		switch (extractionMethod)
		{
			case "simple":
				te = new SimpleMSS();
				break;
			case "supervised":
				te = new SupervisedMSS(trainSource);
				te.setTrainingStrategy(trainingStrategy);
				te.initTrainingSamples(trainingSizePerSource);
				break;
			case "semiSupervised":
				te = new SemiSupervisedMSS(trainSource);
				te.setTrainingStrategy(trainingStrategy);
				te.initTrainingSamples(trainingSizePerSource);
				break;
			default:
				System.err.println("Unknown text extraction method selected!");
				System.exit(-1);
		}
	}
	
	/**
	 * <p>
	 * Predicts the main article of a news related web site.
	 * </p>
	 * 
	 * @param url
	 *            The page to extract the main article
	 * @return The prediction of the main article as plain text
	 */
	public String predictContent(String url)
	{
		if (url == null)
			throw new IllegalArgumentException("No URL to extract content from provided!");
		
		try 
		{
			String content = this.te.predictText(url);
			logger.info("*** {} ***", url);
			logger.info(content);
			logger.info("");
			return content;
		} 
		catch (ExtractionException e) 
		{
			logger.catching(e);
		}
		return null;
	}
	
	/**
	 * <p>
	 * Predicts the main article of each provided news related web site. This
	 * method differs from {@link #predictContent(String)} in that all provided
	 * pages create a single local classifier which is used to predict the main
	 * content from these pages instead of train a single classifier for each
	 * site.
	 * </p>
	 * <p>
	 * This may train a more general and robust classifier but also result in
	 * less accuracy on the prediction for each page.
	 * </p>
	 * 
	 * @param urls
	 * @return
	 */
	public List<String> predictContent(List<String> urls)
	{
		if (urls == null || urls.size() < 1)
			throw new IllegalArgumentException("No URL to extract content from provided!");
		
		try 
		{
			List<String> contents = this.te.predictText(urls);
			for (int i=0; i<urls.size(); i++)
			{
				logger.info("*** {} ***", urls.get(i));
				logger.info(contents.get(i));
				logger.info("");
			}
			return contents;
		} 
		catch (ExtractionException e) 
		{
			logger.catching(e);
		}
		return null;
	}
	
	/**
	 * <p>
	 * The main entrance to the application.
	 * </p>
	 * <p>
	 * Create a new instance of the Main class which on initialization either
	 * trains a new general classifier based on training examples loaded either
	 * from an SQLite DB or from txt-files or it loads an already trained
	 * classifier from a previous run-through.
	 * </p>
	 * <p>
	 * After the initialization the application tries to predict the content for
	 * every URL which was provided via an 'extract=URL' argument where URL is
	 * the URL of the respective news related web site.
	 * </p>
	 * 
	 * @param args
	 *            <p>
	 *            The arguments passed to the application. Currently
	 *            'trainingSizePerSource', 'trainingStrategy',
	 *            'extractionMethod' and 'trainingSource' and 'extract' are
	 *            considered.
	 *            </p>
	 *            <p>
	 *            trainingSizePerSource is the number of samples taken per news
	 *            domain for training
	 *            </p>
	 *            <p>
	 *            trainingStrategy is the strategy used for training. Possible
	 *            values: TRIGRAM, BIGRAM, UNIGRAM, DOUBLE_UNIGRAM and
	 *            TRIPPLE_UNIGRAM
	 *            </p>
	 *            <p>
	 *            extractionMethod is either 'simple', 'supervised' or
	 *            'semiSupervised' and defines the algorithm used for extraction
	 *            </p>
	 *            <p>
	 *            trainingSource can either be FILE, DB or BOTH
	 *            </p>
	 *            <p>
	 *            extract defines a URL to extract and predict content from.
	 *            </p>
	 */
	public static void main(String ... args)
	{
		int trainingSizePerSource = 1500;
		TrainingStrategy trainingStrategy = TrainingStrategy.TRIPLE_UNIGRAM;
		String extractionMethod = null;
		TrainData trainingSource = TrainData.DB;
		// will hold all URLs to extract content from
		List<String> urls = new ArrayList<String>();
		
		// Load settings from config file
		Properties properties = new Properties();
		String confFile = System.getProperty("app.conf");
		if (confFile == null)
			confFile = "ContentExtraction.conf";
		try
		{
			properties.load(Main.class.getResourceAsStream("/"+confFile));
			try
			{
				trainingSizePerSource = Integer.parseInt(properties.getProperty("trainingSizePerSource"));
				logger.info("trainingSizePerSource set to {}", trainingSizePerSource);
			}
			catch(NumberFormatException nfE)
			{
				logger.catching(nfE);
			}
			
			String value = properties.getProperty("trainingStrategy");
			trainingStrategy = TrainingStrategy.valueOf(value);
			if (trainingStrategy == null)
			{
				logger.error("Unknown training strategy provided! Falling back to strategy: TRIPLE_UNIGRAM");
				trainingStrategy = TrainingStrategy.TRIPLE_UNIGRAM;
			}
			else
				logger.info("trainingStrategy set to {}", trainingStrategy);
			
			extractionMethod = properties.getProperty("extractionMethod");
			logger.info("extractionMethod set to {}", extractionMethod);
			
			value = properties.getProperty("trainingSource");
			trainingSource = TrainData.valueOf(value);
			if (trainingSource == null)
			{
				logger.error("Unknown training source provided! Falling back to method: DB");
				trainingSource = TrainData.DB;
			}
			else
				logger.info("trainingSource set to {}", trainingSource);
			
			String _urls = properties.getProperty("extract");
			for (String url : _urls.split("\\s"))
			{
				urls.add(url);
				logger.info("Added {} for extraction", url);
			}
			properties = null;
		}
		catch (IOException e)
		{
			logger.error("Could not load application config file: "+confFile);
			logger.throwing(e);
		}
		
		// if application arguments have been provided overwrite values in conf
		// file
		if (args.length > 0)
		{
			for (String arg : args)
			{
				if(arg.startsWith("trainingSizePerSource"))
				{
					String value = arg.substring("trainingSizePerSource=".length());
					try
					{
						trainingSizePerSource = Integer.parseInt(value);
						logger.info("trainingSizePerSource set to {}", trainingSizePerSource);
					}
					catch(NumberFormatException nfE)
					{
						logger.catching(nfE);
					}
				}
				else if(arg.startsWith("trainingStrategy"))
				{
					String value = arg.substring("trainingStrategy=".length());
					trainingStrategy = TrainingStrategy.valueOf(value);
					if (trainingStrategy == null)
					{
						logger.error("Unknown training strategy provided! Falling back to strategy: TRIPLE_UNIGRAM");
						trainingStrategy = TrainingStrategy.TRIPLE_UNIGRAM;
					}
					else
						logger.info("trainingStrategy set to {}", trainingStrategy);
				}
				else if(arg.startsWith("extractionMethod"))
				{
					extractionMethod = arg.substring("extractionMethod=".length());
					logger.info("extractionMethod set to {}", extractionMethod);
				}
				else if(arg.startsWith("trainingSource"))
				{
					String value = arg.substring("trainingSource=".length());
					trainingSource = TrainData.valueOf(value);
					if (trainingSource == null)
					{
						logger.error("Unknown training source provided! Falling back to method: DB");
						trainingSource = TrainData.DB;
					}
					else
						logger.info("trainingSource set to {}", trainingSource);
				}
				else if (arg.startsWith("extract"))
				{
					String url = arg.substring("extract=".length());
					urls.add(url);
				}
			}
		}
		
		try
		{
			Thread.sleep(5000);
		}
		catch (InterruptedException e)
		{
			e.printStackTrace();
		}
		
		// create a new instance - training or loading of a previously trained 
		// classifier will start automatically after initialization
		Main main = new Main(extractionMethod, trainingStrategy, trainingSource, trainingSizePerSource);
				
		// with SemiSupervised approach all different pages train a single local
		// classifier that tries to extract the main content of the specific
		// page as the classifier is rather train on general features, results 
		// are sometimes not that accurate
		main.predictContent(urls);
		
		// preferred method for SemiSupervised approach as each page creates its 
		// own classifier which is trained on site-specific features and 
		// therefore returns more accurate results than the more general 
		// approach
//		for (String url : urls)
//			main.predictContent(url);
	}
}