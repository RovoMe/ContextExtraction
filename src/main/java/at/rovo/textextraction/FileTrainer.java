package at.rovo.textextraction;

import at.rovo.classifier.Classifier;
import at.rovo.textextraction.mss.TrainFeatureStrategy;
import at.rovo.textextraction.mss.TrainingEntry;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * <p>
 * Is a concrete implementation of a {@link TrainingDataStrategy} which loads
 * data from text files located in the <code>trainingDir</code> directory
 * specified in the constructor.
 * </p>
 */
public class FileTrainer extends AbstractTrainer
{
	private final static Logger LOG = LogManager.getLogger(FileTrainer.class);

	public FileTrainer(File trainingDir, int trainingSampleSize, TrainFeatureStrategy trainFeatureStrategy)
	{
		super(trainingDir, trainingSampleSize, trainFeatureStrategy);
	}

	@Override
	public Classifier<String, String> trainModel(Classifier<String, String> classifier, boolean ... retrain)
	{
		// check if the optional parameter was set
		boolean _retrain = false;
		if (retrain != null && retrain.length > 0)
		{
			_retrain = retrain[0];
		}

		// we train either if no previous training data are available or we
		// explicitly specified to retrain the classifier
		if (_retrain || !this.isCommonTagsAvailable())
		{
			// first check if there are already serialized objects present
			FilenameFilter filter = new FilenameFilter()
			{
				public boolean accept(File dir, String name)
				{
					return name.endsWith(".txt");
				}
			};

			// iterate through all files found
			File[] trainingFiles = trainingDir.listFiles(filter);
			for (File file : trainingFiles)
			{
				LOG.info("Using File {} for training", file.getAbsolutePath());
				long startTime = System.currentTimeMillis();

				TrainingEntry entry = new TrainingEntry();
				// read the data from the file
				try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file.getAbsolutePath()), "UTF-8")))
				{
					String line;
					StringBuilder text = new StringBuilder();
					int lineNr = 0;
					while ((line = br.readLine()) != null)
					{
						if (lineNr == 0)
						{
							entry.setUrl(line);
							// extract the domain-name to use it as key for a map
							String url = line;
							if (url.startsWith("http://"))
							{
								url = line.substring("http://".length());
							}
							if (url.contains("/"))
							{
								url = url.substring(0, url.indexOf("/"));
							}
							entry.setUrl(url);

							entry.setClassifier(classifier);
						}
						else if (lineNr == 1)
						{
							entry.setCategory(line);
						}
						else
						{
							text.append(" ");
							text.append(line);
						}

						lineNr++;
					}
					entry.setCommonTags(this.commonTags);
					entry.setText(text.toString());

					// start training
					entry.train(false);
				}
				catch (IOException ioEx)
				{
					LOG.error("Error while train from sample files", ioEx);
				}

				LOG.info("\tTraining took {} ms", (System.currentTimeMillis() - startTime));
			}

			// serialize the classifier so we do not have to train it on every new call
			classifier.saveData(trainingDir, "mssClassificationData" + "_" + trainingSampleSize + "_" + trainFeatureStrategy.name() + ".ser");
			this.saveCommonTags(commonTags, trainingDir, "commonTags");
		}
		else
		{
			// we need to load the previously trained data from the directory
			// which contains the training data
			classifier = this.loadExistingData(classifier);
		}

		return classifier;
	}
}
