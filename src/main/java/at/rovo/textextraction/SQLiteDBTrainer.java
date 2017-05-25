package at.rovo.textextraction;

import at.rovo.classifier.Classifier;
import at.rovo.textextraction.mss.TrainFeatureStrategy;
import at.rovo.textextraction.mss.TrainingEntry;
import com.almworks.sqlite4java.SQLiteConnection;
import com.almworks.sqlite4java.SQLiteStatement;
import java.io.File;
import java.io.FilenameFilter;
import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Is a concrete implementation of a {@link TrainingDataStrategy} which loads data from a SQLite database and trains a
 * given model.
 */
public class SQLiteDBTrainer extends AbstractTrainer
{
    /** The logger of this claas **/
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    /** The SQL commands to execute **/
    protected Map<String, String> sqlCommands = new TreeMap<>();

    /**
     * Creates a new instance of a concrete strategy which trains a classifier with data contained in a SQLite database
     * within the given <code>trainingDir</code> directory. This directory contains all the training data and eventually
     * persisted models of previous runs.
     *
     * @param trainingDir
     *         The directory containing the SQLite training database
     * @param sources
     *         The sources to load from the database. A source is a certain newspaper domain like f.e.
     *         <em>nytimes.com</em>
     * @param trainingSampleSize
     *         The number of samples to train for each source
     * @param trainFeatureStrategy
     *         The strategy to use for training feature. This specifies if the classifier will train UNIGRAMs, BIGRAMs
     *         or TRIGRAMs.
     */
    public SQLiteDBTrainer(File trainingDir, List<String> sources, int trainingSampleSize,
                           TrainFeatureStrategy trainFeatureStrategy)
    {
        super(trainingDir, trainingSampleSize, trainFeatureStrategy);

        this.addQueryForAllSources(sources, trainingSampleSize);
    }

    /**
     * Specifies to train <code>sampleSize</code> examples per given source.
     *
     * @param sources
     *         The sources to train samples for
     * @param sampleSize
     *         The number of samples to train for each source
     */
    public void addQueryForAllSources(List<String> sources, int sampleSize)
    {
        for (String source : sources)
        {
            this.addQueryForSource(source, sampleSize);
        }
    }

    /**
     * Specifies to train <code>sampleSize</code> examples for the given source.
     *
     * @param source
     *         The source to train samples for
     * @param sampleSize
     *         The number of samples to train for the given source
     */
    public void addQueryForSource(String source, int sampleSize)
    {
        String sql = "SELECT p.Source, p.URL, p.HTML, e.Start, e.Length " +
                     "FROM Extractions AS e, Pages AS p " +
                     "WHERE e.DocumentID=p.DocumentID AND p.Source='" + source + "' Limit " + sampleSize;
        this.sqlCommands.put(source, sql);
    }

    private boolean isSerializationFileAvailable(final String fileName)
    {
        // first check if there are already serialized objects present
        FilenameFilter filter = (dir, name) -> name.equals(fileName);
        // check the training directory if there are any serialized objects from previous trainings
        File[] serObjects = trainingDir.listFiles(filter);
        boolean available = serObjects != null && serObjects.length > 0;
        LOG.info("Serialization file {} available: {}", fileName, available);
        return available;
    }

    @Override
    public Classifier<String, String> trainModel(Classifier<String, String> classifier, boolean... retrain)
    {
        final String fileName =
                "mssClassificationData" + "_" + trainingSampleSize + "_" + trainFeatureStrategy.name() + ".ser";

        if (sqlCommands.isEmpty())
        {
            throw new UnsupportedOperationException("No SQL command to execute specified");
        }

        // check if the optional parameter was set
        boolean _retrain = false;
        if (retrain != null && retrain.length > 0)
        {
            _retrain = retrain[0];
        }

        // we train either if no previous training data are available or we explicitly specified to retrain the
        // classifier
        if (_retrain || !this.isSerializationFileAvailable(fileName)) //!this.isCommonTagsAvailable())
        {
            // either no or not all serialized objects have been found - train them from the db
            String dbFile = trainingDir.getAbsoluteFile() + "/ate.db";
            LOG.info("Train classifiers from scratch! Using {}, Strategy used: {}", dbFile,
                     trainFeatureStrategy.name());
            // create a new db-object
            SQLiteConnection db = null;
            try
            {
                db = new SQLiteConnection(new File(dbFile));
                // open a new db connection
                db.open(true);
                for (String source : sqlCommands.keySet())
                {
                    SQLiteStatement st = db.prepare(sqlCommands.get(source));
                    // this.printTableHeader(st);

                    // run through every found entry and store required data in a TrainingEntry object which will later
                    // on used to train the local classifier
                    while (st.step())
                    {
                        try
                        {
                            TrainingEntry entry = new TrainingEntry();
                            // if there is already a classifier for this source, use it else create a new one
                            String src = st.columnString(0);

                            entry.setTrainFeatureStrategy(trainFeatureStrategy);
                            entry.setClassifier(classifier);
                            entry.setUrl(st.columnString(1));
                            entry.setSourceUrl(src);
                            entry.setCommonTags(commonTags);
                            String html = st.columnString(2);
                            html = html.replaceAll("\\s", " ");
                            entry.setHTML(html);

                            // labeled article text extraction
                            // as the DB only contains the start position and the length of the text we have to extract
                            // it from the full-HTML code retrieved in the previous step
                            LOG.debug("start: {}", st.columnInt(3));
                            LOG.debug("length: {}", st.columnInt(4));
                            LOG.debug("source: {}", st.columnString(0));
                            LOG.debug("html: {}", html);

                            String text = html.substring(st.columnInt(3), st.columnInt(3) + st.columnInt(4));
                            entry.setFormatedText(text);
                            LOG.debug("text: {}", entry.getText());
                            entry.train(false);
                        }
                        catch (Exception ex)
                        {
                            LOG.warn("Skipping training on " + source + ". Reason: " + ex.getLocalizedMessage(), ex);
                        }
                    }
                    st.dispose();
                }
                LOG.info("Persisting trained knowledge base '{}' into {} directory", fileName, trainingDir);
                // serialize the classifier so we do not have to train it on every new call
                classifier.saveData(trainingDir, "mssClassificationData" + "_" + trainingSampleSize + "_" +
                                                 trainFeatureStrategy.name() + ".ser");
                this.saveCommonTags(commonTags, trainingDir, "commonTags");
            }
            catch (Exception e)
            {
                LOG.error("Error while reading training samples from the database. Reason: "
                          + e.getLocalizedMessage(), e);
            }
            finally
            {
                if (null != db)
                {
                    db.dispose();
                }
            }
        }
        else
        {
            // we need to load the previously trained data from the directory which contains the training data
            classifier = this.loadExistingData(classifier);
        }
        return classifier;
    }
}
