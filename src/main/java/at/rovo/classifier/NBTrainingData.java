package at.rovo.classifier;

import java.io.Serializable;
import java.util.Hashtable;
import java.util.Map;

public class NBTrainingData<F,C> implements Serializable, TrainingData<F,C>
{
	private static final long serialVersionUID = -2101815681608863601L;
	/** Map containing the trained data */
	private Map<C,CategoryEntry<F,C>> categories = null;
	
	NBTrainingData()
	{
		this.categories = new Hashtable<C,CategoryEntry<F,C>>();
	}

	public void incrementFeature(F feature, C category)
	{
		CategoryEntry<F,C> cat = this.categories.get(category);
		if (cat != null)
		{
			Integer i = cat.getFeatures().get(feature);
			if (i != null)
				cat.getFeatures().put(feature, i+1);
			else
				cat.getFeatures().put(feature, 1);
		}
		else
			this.categories.put(category, new CategoryEntry<F,C>(feature));
	}
	
	public void incrementNumberOfSamplesForCategory(C category)
	{
		CategoryEntry<F,C> catEntry = this.categories.get(category);
		if (catEntry != null)
			this.categories.put(category, catEntry.increment());
		else
			this.categories.put(category, new CategoryEntry<F,C>());
	}
	
	@Override
	public Map<C, CategoryEntry<F,C>> getData() 
	{
		return this.categories;
	};
}
