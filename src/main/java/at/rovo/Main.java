package at.rovo;

import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import at.rovo.textextraction.ExtractionException;
import at.rovo.textextraction.TextExtractor;
import at.rovo.textextraction.TrainData;
import at.rovo.textextraction.mss.*;

public class Main 
{
	private static Logger logger = LogManager.getLogger(Main.class.getName());
	
	private TextExtractor te = null;
	
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
	
	public List<String> predictContent(List<String> urls)
	{
		if (urls == null || urls.size() < 1)
			throw new IllegalArgumentException("No URL to extract content from provided!");
		
		try 
		{
			List<String> contents = this.te.predictText(urls);
			for (int i=0; i<urls.size(); i++)
			{
				logger.info("*** "+urls.get(i)+" ***");
				logger.info(contents.get(i));
				logger.info("");
			}
			return contents;
		} 
		catch (ExtractionException e) 
		{
			logger.error(e);
		}
		return null;
	}
	
	public static void main(String ... args)
	{
		int trainingSizePerSource = 1500;
		TrainingStrategy trainingStrategy = TrainingStrategy.TRIPLE_UNIGRAM;
		String extractionMethod = null;
		TrainData trainingSource = TrainData.DB;
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
						logger.info("trainingSizePerSource set to "+trainingSizePerSource);
					}
					catch(NumberFormatException nfE)
					{
						logger.error(nfE);
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
						logger.info("trainingStrategy set to "+trainingStrategy);
				}
				else if(arg.startsWith("extractionMethod"))
				{
					extractionMethod = arg.substring("extractionMethod=".length());
					logger.info("extractionMethod set to "+extractionMethod);
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
						logger.info("trainingSource set to "+trainingSource);
				}
			}
		}
		
		Main main = new Main(extractionMethod, trainingStrategy, trainingSource, trainingSizePerSource);
		
		List<String> urls = new ArrayList<String>();
		urls.add("http://www.independent.co.uk/news/uk/politics/deficit-reduction-blow-as-figures-reveal-government-borrowed-3-billion-more-than-expected-last-month-8069220.html");
		urls.add("http://www.independent.co.uk/sport/olympics/news/ioc-president-jacques-rogge-says-usain-bolt-is-not-a-legend-yet-8030630.html");
		urls.add("http://www.independent.co.uk/news/uk/crime/grandmother-of-missing-tia-sharp-pleads-for-her-return-8030809.html");
		urls.add("http://www.independent.co.uk/sport/football/premier-league/manchester-united-lower-stock-flotation-value-8030537.html");
		urls.add("http://www.independent.co.uk/life-style/food-and-drink/news/opening-soon-tesco-espresso-8027282.html");
		urls.add("http://www.independent.co.uk/travel/africa/zanzibar-adventure-on-the-high-seas-8015606.html"); 
		
		// Mentioned 12 well-known newspaper websites in the paper:
		
		urls.add("http://abcnews.go.com/Blotter/al-qaeda-releases-video-american-hostage/story?id=17221075#.UFDw4VHiD64");
		urls.add("http://edition.cnn.com/2012/08/13/world/europe/norway-massacre-report/index.html?hpt=hp_t3");
		urls.add("http://www.foxnews.com/politics/2012/08/13/in-iowa-face-off-ryan-hammers-jobs-message-as-obama-employs-drought-politics/");
		urls.add("http://latimesblogs.latimes.com/world_now/2012/08/norway-killer-could-have-been-stopped-sooner-report.html");
		urls.add("http://www.latimes.com/business/technology/la-fi-tn-curiousity-mars-panorama-20120813,0,956619.story");
		urls.add("http://www.bbc.co.uk/news/world-europe-19241327");
		urls.add("http://news.cnet.com/8301-17852_3-57492229-71/obama-to-nasa-i-want-to-know-about-martians-right-away/");
		urls.add("http://www.washingtonpost.com/business/technology/google-to-make-deep-cuts-at-motorola/2012/08/13/501f20b2-e53b-11e1-8f62-58260e3940a0_story.html?hpid=z3");
		urls.add("http://www.washingtonpost.com/business/economy/romney-chose-paul-ryan-to-shift-the-campaign-debate-will-the-gamble-pay-off/2012/08/13/f9ae54e2-e557-11e1-9739-eef99c5fb285_story.html");
		urls.add("http://www.usatoday.com/news/politics/story/2012-08-13/ryan-romney-poll/57038326/1");
		urls.add("http://www.nytimes.com/2012/09/13/world/middleeast/us-envoy-to-libya-is-reported-killed.html?src=mv&ref=general");

		// non-news
		 
		urls.add("http://www.englisharticles.info/2012/07/07/how-effective-is-advertising/");
		urls.add("http://www.englisharticles.info/2012/08/09/sportswear/");
//		urls.add("http://www.vogella.com/articles/JavaRegularExpressions/article.html");
		
		main.predictContent(urls);
	}
}