package at.rovo.textextraction;

import at.rovo.classifier.Classifier;
import at.rovo.textextraction.mss.TrainFeatureStrategy;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.lang.invoke.MethodHandles;
import java.util.Dictionary;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This abstract base class provides some common methods for all training strategies like loading and persisting of
 * common tags.
 */
public abstract class AbstractTrainer implements TrainingDataStrategy
{
    /** The logger of this class **/
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    /** The directory which contains the training data **/
    protected final File trainingDir;
    /**
     * The number of samples to train the classifier for each source. By default 2000 samples will be trained
     **/
    protected int trainingSampleSize = 2000;
    /** Defines which strategy is followed by training features **/
    protected TrainFeatureStrategy trainFeatureStrategy = TrainFeatureStrategy.BIGRAM;
    /** A list of common tags and the number of sources they occur **/
    protected Dictionary<String, List<String>> commonTags = new Hashtable<>();

    protected AbstractTrainer(File trainingDir, int trainingSampleSize, TrainFeatureStrategy trainFeatureStrategy)
    {
        if (trainingDir == null || !trainingDir.exists())
        {
            throw new IllegalArgumentException("Could not find trainingData directory");
        }

        this.trainingDir = trainingDir;
        this.trainingSampleSize = trainingSampleSize;
        this.trainFeatureStrategy = trainFeatureStrategy;
    }

    /**
     * Determines if in a previous iteration common tags were persisted. These method loads data from
     * <code>commonTags.ser</code> into memory and provides access to the loaded data via the <em>commonTags</em> field
     * of this class.
     *
     * @return true if there was already a <em>commonTags.ser</em> file within the directory that contains the training
     * data, false otherwise
     */
    protected boolean isCommonTagsAvailable()
    {
        // first check if there are already serialized objects present
        FilenameFilter filter = (dir, name) -> name.equals("commonTags.ser");
        // check the training directory if there are any serialized objects
        // from previous trainings
        File[] serObjects = trainingDir.listFiles(filter);
        if (serObjects.length > 0)
        {
            LOG.info("Trying to reuse previously trained classifier");
            for (File serObject : serObjects)
            {
                // copy the values into the common tags dictionary
                Dictionary<String, List<String>> loadedTags = this.loadCommonTags(serObject);
                for (Enumeration<String> e = loadedTags.keys(); e.hasMoreElements(); )
                {
                    String key = e.nextElement();
                    commonTags.put(key, loadedTags.get(key));
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Loads a list of common tags from a file called 'commonTags.ser' via java object serialization into memory.
     *
     * @param serializedObject
     *         A reference to the {@link java.io.File} representing the serialized object
     *
     * @return The object containing the common tags; null otherwise
     */
    @SuppressWarnings("unchecked")
    protected Dictionary<String, List<String>> loadCommonTags(File serializedObject)
    {
        Dictionary<String, List<String>> dict = null;
        try (ObjectInputStream ois = new ObjectInputStream(
                new BufferedInputStream(new FileInputStream(serializedObject))))
        {
            Object obj = ois.readObject();
            if (obj instanceof Hashtable<?, ?>)
            {
                dict = (Hashtable<String, List<String>>) obj;
                if (LOG.isTraceEnabled())
                {
                    LOG.trace("Found a list of common tags: {} - {}", serializedObject.getName(), dict);
                }
            }
            else if (obj instanceof Dictionary<?, ?>)
            {
                dict = (Dictionary<String, List<String>>) obj;
                if (LOG.isTraceEnabled())
                {
                    LOG.info("Found a list of common tags: {} - {}", serializedObject.getName(), dict);
                }
            }
        }
        catch (IOException | ClassNotFoundException e)
        {
            LOG.error("Error while reading common tags file", e);
        }
        return dict;
    }


    /**
     * Persists the List of common tags via java object serialization to a file in a defined directory.
     *
     * @param dict
     *         The {@link Dictionary} of common tags with their sources they occurred
     * @param directory
     *         The directory the {@link Dictionary} should be saved in
     * @param name
     *         The name of the {@link File} which will hold the bytes of the persisted object
     */
    protected void saveCommonTags(Dictionary<String, List<String>> dict, File directory, String name)
    {
        File commonTagsFile = new File(directory.getAbsoluteFile() + "/" + name + ".ser");
        try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(commonTagsFile)))
        {
            try (ObjectOutput object = new ObjectOutputStream(bos))
            {
                object.writeObject(dict);
            }
            catch (IOException e)
            {
                LOG.error("Error while persisting common tags to file", e);
            }
        }
        catch (IOException e)
        {
            LOG.error("Error while managing common tags file", e);
        }
    }

    /**
     * Loads a previously trained model into the provided classifier.
     *
     * @param cls
     *         The classifier to load the data into
     *
     * @return The classifier with the loaded data if the file could be found
     */
    protected Classifier<String, String> loadExistingData(Classifier<String, String> cls)
    {
        // first check if there are already serialized objects present
        FilenameFilter filter =
                (dir, name) -> name.endsWith("_" + trainingSampleSize + "_" + trainFeatureStrategy.name() + ".ser");
        // check the training directory if there are any serialized objects
        // from previous trainings
        File[] serObjects = trainingDir.listFiles(filter);
        if (serObjects.length > 0)
        {
            LOG.info("Trying to reuse previously trained classifier");
            if (serObjects.length > 1)
            {
                LOG.warn(
                        "On trying to load already trained data multiple files were found. Using the first one found.");
            }

            if (!cls.loadData(serObjects[0]))
            {
                LOG.error("Failure loading data file for {}", cls);
            }
            else
            {
                LOG.info("Previously trained data loaded successfully");
            }
        }
        return cls;
    }
}
