package at.rovo.classifier;

import java.util.Map;

/**
 * <p>Specifies certain methods common to the training process of classifiers.</p>
 * 
 * @param <F> The type of the feature to train
 * @param <C> The type of the category a feature will be associated with
 * @author Roman Vottner
 */
public interface TrainingData<F,C>
{
	/**
	 * <p>Returns all stored data as a {@link Map} with the category as key
	 * and a {@link CategoryEntry} as value.</p>
	 * 
	 * @return The trained data
	 */
	Map<C,CategoryEntry<F,C>> getData();
	
	/**
	 * <p>Increments the number of a certain feature in a certain category, f.e
	 * the number of 'money' words in the category of spam-mails</p>
	 * 
	 * @param feature The feature to increment its number
	 * @param category The category the feature is in
	 */
	void incrementFeature(F feature, C category);
	
	/**
	 * <p>Increments the number of samples for a certain category</p>
	 * 
	 * @param category The category whose sample-size should be incremented by one
	 */
	void incrementNumberOfSamplesForCategory(C category);
}
