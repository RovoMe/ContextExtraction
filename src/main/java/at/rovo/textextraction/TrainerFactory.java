package at.rovo.textextraction;

import at.rovo.textextraction.mss.TrainFeatureStrategy;
import java.io.File;
import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A simple factory method to create a trainer depending on the specified <em>trainData</em> value.
 */
public class TrainerFactory
{
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    /**
     * Disallow instantiations of this class.
     */
    private TrainerFactory()
    {

    }

    /**
     * Creates a trainer according to the provided <em>trainData</em> value.
     *
     * @param trainData
     *         Specifies which kind of trainer the classifier should be trained with
     * @param trainingDir
     *         The directory containing the training samples
     * @param sources
     *         The sources data should be trained for. A source is a newspaper domain like f.e.
     *         <code>nytimes.com</code>
     * @param samplesPerSource
     *         Specifies the number of samples to be trained per source
     * @param trainFeatureStrategy
     *         Secifies which strategy to use for training features. This can either be training on UNIGRAM, BIGRAM or
     *         TRIGRAM features
     *
     * @return The classifiers trainer
     */
    public static List<TrainingDataStrategy> createTrainer(TrainData trainData, File trainingDir, List<String> sources,
                                                           int samplesPerSource,
                                                           TrainFeatureStrategy trainFeatureStrategy)
    {
        List<TrainingDataStrategy> strategies = new ArrayList<>();

        switch (trainData)
        {
            case DB:
                LOG.info("Initializing SQLite database trainer");
                strategies.add(new SQLiteDBTrainer(trainingDir, sources, samplesPerSource, trainFeatureStrategy));
                break;
            case FILE:
                LOG.info("Initializing file trainer");
                strategies.add(new FileTrainer(trainingDir, samplesPerSource, trainFeatureStrategy));
                break;
            default:
                LOG.info("Initializing both trainers");
                strategies.add(new SQLiteDBTrainer(trainingDir, sources, samplesPerSource, trainFeatureStrategy));
                strategies.add(new FileTrainer(trainingDir, samplesPerSource, trainFeatureStrategy));
                break;
        }
        return strategies;
    }
}
