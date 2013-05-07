package at.rovo.classifier;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * <p>Core class for any classifier. It requires extending classes to implement some
 * typical methods for any classifier as <code>train()</code> and <code>classify()</code>.
 * </p>
 * <p>Further it is able to save and load its data from and to disk, therefore it requires
 * that categories as well as features have to implement {@link Serializable}.</p>
 *
 * @param <F> Type of the features this classifier has to deal with
 * @param <C> Type of the categories this classifier supports
 * @author Roman Vottner
 */
public abstract class Classifier<F extends Serializable, C extends Serializable>
{
	private static Logger logger = LogManager.getLogger(Classifier.class.getName());
	/**
	 * The actual training data which it uses to classify features
	 */
	protected TrainingData<F,C> trainingData = null;
	
	/**
	 * Name of the classifier 
	 */
	private String name = "";
	
	/**
	 * <p>Instantiates necessary data structures for subclasses.</p>
	 */
	public Classifier()
	{
		
	}
	
	/**
	 * <p>Instantiates necessary data structures for subclasses and
	 * assign a name to the classifier.</p>
	 * 
	 * @param name The name of the classifier
	 */
	public Classifier(String name)
	{
		this.name = name;
	}
	
	/**
	 * <p>Sets the name of the classifiers' instance</p>
	 * 
	 * @param name New name of the classifier
	 */
	public void setName(String name)
	{
		this.name = name;
	}
	
	/**
	 * <p>Returns the name of the classifiers' instance</p>
	 * 
	 * @return Name of the classifier
	 */
	public String getName()
	{
		return this.name;
	}
	
	/**
	 * <p>Persists a {@link Classifier}s data object via java object serialization 
	 * to a file in a defined directory.</p>
	 * 
	 * @param directory The directory the {@link Classifier} should be saved in
	 * @param name The name of the {@link File} which will hold the bytes of the
	 *             persisted object.
	 */
	public void saveData(File directory, String name)
	{
		try 
		{
			FileOutputStream fos = new FileOutputStream(directory.getAbsoluteFile()+"\\"+name);
			BufferedOutputStream bos = new BufferedOutputStream(fos);
			ObjectOutput object = null;
			try 
			{
				object = new ObjectOutputStream(bos);
				object.writeObject(this.trainingData);
			} 
			catch (IOException e) 
			{
				logger.error(e);
			}
			finally
			{
				if (object != null)
					object.close();
				if (bos != null)
					bos.close();
				if (fos != null)
					fos.close();
			}
		} 
		catch (FileNotFoundException e) 
		{
			logger.error(e);
		} 
		catch (IOException e)
		{
			logger.error(e);
		}
	}
	
	/**
	 * <p>Loads data from a previous classification into the classifier.</p>
	 * 
	 * @param serializedObject A reference to the {@link File} representing
	 *                         the serialized object
	 * @return true if the data could be loaded; false otherwise
	 */
	@SuppressWarnings("unchecked")
	public boolean loadData(File serializedObject)
	{
		TrainingData<F,C> data = null;
		try
		{
			FileInputStream fis = new FileInputStream(serializedObject);
			BufferedInputStream bis = new BufferedInputStream(fis);
			ObjectInputStream ois = new ObjectInputStream(bis);
			try
			{
				Object obj = ois.readObject();
				if (obj instanceof TrainingData)
				{
					data = (TrainingData<F, C>)obj;
					if (logger.isInfoEnabled())
						logger.info("Found trained data for: "+data);
				}
				else
					if (logger.isErrorEnabled())
						logger.error("File is not a valid data object for this classifier!");
			}
			catch (IOException ioEx)
			{
				if (logger.isErrorEnabled())
					logger.error(ioEx.getLocalizedMessage(), ioEx);
			} 
			catch (ClassNotFoundException e) 
			{
				if (logger.isErrorEnabled())
					logger.error(e.getLocalizedMessage(), e);
			}
			finally
			{
				if (ois != null)
					ois.close();
				if (bis != null)
					bis.close();
				if (fis != null)
					fis.close();
			}
		}
		catch (FileNotFoundException fnfEx)
		{
			if (logger.isErrorEnabled())
				logger.error(fnfEx.getLocalizedMessage(), fnfEx);
		}
		catch (IOException e) 
		{
			if (logger.isErrorEnabled())
				logger.error(e.getLocalizedMessage(), e);
		}
		
		if (data != null)
		{
			this.trainingData = data;
			return true;
		}
		return false;
	}
	
	/**
	 * <p>Trains the classifier for a single feature.</p>
	 * <p>The category is used to label the item/s, f.e. to be a good 
	 * ('good') example or to be within ('in') an articles content. This
	 * is later on used to decide if a certain feature is more likely to
	 * be in a certain category or not.</p>
	 * 
	 * @param item A {@link String} contains only one word that 
	 *             should be trained for a given category.
	 * @param category The label of the item, f.e. 'good' or 'in', 
	 *                 the classifier should use to decide later on
	 *                 what results to predict
	 */
	public abstract void train(F item, C category);
	
	/**
	 * <p>Trains the classifier with the specified items to be in a
	 * certain category.</p>
	 * <p>The category is used to label the item/s, f.e. to be a good 
	 * ('good') example or to be within ('in') an articles content. This
	 * is later on used to decide if a certain feature is more likely to
	 * be in a certain category or not.</p>
	 * 
	 * @param items An array of {@link String} containing all the words 
	 *              that should be trained for a given category.
	 * @param category The label of the item, f.e. 'good' or 'in', 
	 *                 the classifier should use to decide later on
	 *                 what results to predict
	 */
	public abstract void train(F[] items, C category);
	
	/**
	 * <p>Trains the classifier with the specified items to be in a
	 * certain category.</p>
	 * <p>The category is used to label the item/s, f.e. to be a good 
	 * ('good') example or to be within ('in') an articles content. This
	 * is later on used to decide if a certain feature is more likely to
	 * be in a certain category or not.</p>
	 * 
	 * @param items A {@link List} of {@link String}s containing all 
	 *              the words that should be trained for a given category.
	 * @param category The label of the item, f.e. 'good' or 'in', 
	 *                 the classifier should use to decide later on
	 *                 what results to predict
	 */
	public abstract void train(List<F> items, C category);
	
	/**
	 * <p>Calculates the a-posterior probability of a certain item to be within
	 * a specific category</p>
	 * 
	 * @param item The item whose probability should be calculated to 
	 *             be in a certain category
	 * @param category The category the item should be in
	 * @return The probability of the item being in the provided category
	 */
	public abstract double getProbability(C category, F item);
	
	/**
	 * <p>Calculates the a-posterior probability for certain items to be within
	 * a specific category</p>
	 * 
	 * @param items The item whose probability should be calculated to 
	 *              be in a certain category
	 * @param category The category the item should be in
	 * @return The probability of the item being in the provided category
	 */
	public abstract double getProbability(C category, F[] items);
	
	/**
	 * <p>Calculates the a-posterior probability of a certain item to be within
	 * a specific category.</p>
	 * <p>A <em>smoothingPrior</em> of 1 corresponds to a Laplace smoothing while
	 * values between > 0 and < 1 are called Lidstone smoothing.</p>
	 * 
	 * @param item The item whose probability should be calculated to 
	 *             be in a certain category
	 * @param category The category the item should be in
	 * @param smoothingPrior accounts for features not present in the learning 
	 *                       samples and prevents zero probabilities in further 
	 *                       computations
	 * @return The probability of the item being in the provided category
	 */
	public abstract double getSmoothedProbability(C category, F item, double smoothingPrior);
	
	/**
	 * <p>Calculates the a-posterior probability for certain items to be within
	 * a specific category</p>
	 * <p>A <em>smoothingPrior</em> of 1 corresponds to a Laplace smoothing while
	 * values between > 0 and < 1 are called Lidstone smoothing.</p>
	 * 
	 * @param items The item whose probability should be calculated to 
	 *              be in a certain category
	 * @param category The category the item should be in
	 * @param smoothingPrior accounts for features not present in the learning 
	 *                       samples and prevents zero probabilities in further 
	 *                       computations
	 * @return The probability of the item being in the provided category
	 */
	public abstract double getSmoothedProbability(C category, F[] items, double smoothingPrior);
	
	/**
	 * <p>Calculates the a-posterior probability of a certain item to be within
	 * a specific category</p>
	 * 
	 * @param item The item whose probability should be calculated to 
	 *             be in a certain category
	 * @param category The category the item should be in
	 * @return The probability of the item being in the provided category
	 */
	public abstract double getWeightedProbability(C category, F item);
	
	/**
	 * <p>Calculates the a-posterior probability for certain items to be within
	 * a specific category</p>
	 * 
	 * @param items The item whose probability should be calculated to 
	 *              be in a certain category
	 * @param category The category the item should be in
	 * @return The probability of the item being in the provided category
	 */
	public abstract double getWeightedProbability(C category, F[] items);
	
	/**
	 * <p>Tries to predict the category a certain item is most likely 
	 * to be in</p>
	 * 
	 * @param item The item which category should be predicted
	 * @return The predicted category the item is most likely to be in
	 */
	public abstract C classify(F item);
	
	/**
	 * <p>Tries to predict the category certain items are most likely 
	 * to be in</p>
	 * 
	 * @param items The items which category should be predicted
	 * @return The predicted category the items are most likely to be in
	 */
	public abstract C classify(F[] items);
}
