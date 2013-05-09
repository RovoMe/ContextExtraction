package at.rovo.classifier;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * <p>Implementation of a naive Bayes classifier which uses probabilities extracted
 * from training examples to divide certain candidates into their appropriate classes.</p>
 * <p>The current implementation only supports a multinomial event model.</p>
 * <p>This implementation was originally based on the code presented in "Programming 
 * Collective Intelligence" by Toby Segaran (ISBN: 978-0-596-52932-1; 2007) but has
 * changed massively since the beginning.</p>
 * 
 * @author Roman Vottner
 */
public class NaiveBayes<F extends Serializable, C extends Serializable> extends Classifier<F,C>
{
	private static Logger logger = LogManager.getLogger(NaiveBayes.class.getName());
	
	/** All our data is stored here */
	private Map<C, Double> threshold = new Hashtable<C, Double>();
	// for faster lookup
	/** Contains the probability for each category */
	private Map<C, Double> catProb = null;
	/** The total number of features trained **/
	private long totalNumberOfFeatures = 0L;
	
	/**
	 * <p>Creates a new default instance of this class.</p>
	 */
	public NaiveBayes()
	{
		super();
		this.catProb = new Hashtable<C,Double>();
	}
	
	/**
	 * <p>Create a new instance of this class and sets its name to the value of 
	 * the provided argument.</p>
	 * 
	 * @param name The name of this instance
	 */
	public NaiveBayes(String name)
	{
		super(name);
		this.catProb = new Hashtable<C,Double>();
	}
		
	/**
	 * <p>Sets the threshold for a certain category</p>
	 * 
	 * @param category The category the threshold should be applied to
	 * @param t The new value of the threshold
	 */
	public void setThreshold(C category, double t)
	{
		this.threshold.put(category, t);
	}
	
	/**
	 * <p>Returns the threshold for the specified category of the current instance.</p>
	 * 
	 * @param category The category the threshold is set for
	 * @return The current threshold of the specified category
	 */
	public double getThreshold(C category)
	{
		if (!this.threshold.containsKey(category))
			return 1.0;
		return this.threshold.get(category);
	}
	
	/**
	 * <p>Counts the number of times a certain feature appeared in all categories</p>
	 * 
	 * @param feature The feature of interest
	 * @return The number of times this feature appeared in all categories
	 */
	private long getFeatureCount(F feature)
	{
		long sum = 0;
		for (C category : this.trainingData.getData().keySet())
			sum += this.getFeatureCount(feature, category);
		return sum;
	}
	
	/**
	 * <p>Returns the number of categories used throughout the training of the
	 * classifier.</p>
	 * @return The number of categories
	 */
	private int getNumberOfCategories()
	{
		return this.trainingData.getData().size();
	}
	
	/**
	 * <p>Returns the total number of features trained.</p>
	 * 
	 * @return The total number of features trained
	 */
	private long getTotalNumberOfFeatures()
	{
		if (this.totalNumberOfFeatures == 0L)
		{
			Set<F> features = new HashSet<>();
			for (C category : this.trainingData.getData().keySet())
			{
				features.addAll(this.trainingData.getData().get(category).getFeatures().keySet());
			}
			this.totalNumberOfFeatures = features.size();
		}
		return this.totalNumberOfFeatures;
	}
	
	/**
	 * <p>The number of samples for a specific category</p>
	 * 
	 * @param category The category whose trained samples should be returned
	 * @return The number of samples trained for this category
	 */
	protected long getNumberOfSamplesForCategory(C category)
	{
		CategoryEntry<F,C> catEntry = this.trainingData.getData().get(category);
		if (catEntry != null)
			return catEntry.getNumSamplesForCategory();
		return 0;
	}
	
	/**
	 * <p>The total number of samples trained</p>
	 * 
	 * @return The number of all samples trained
	 */
	protected long getTotalNumberOfSamples()
	{
		long sum = 0;
		for (CategoryEntry<F,C> entry : this.trainingData.getData().values())
			sum += entry.getNumSamplesForCategory();
		return sum;
	}
	
	/**
	 * <p>The number of times a feature has appeared in a category</p>
	 * 
	 * @param feature The feature of interest
	 * @param category The category the feature should be in (f.e. marked as 
	 *                 'good' entry)
	 * @return The absolute count of the feature among all examples labeled
	 *         as the specified category
	 */
	protected int getFeatureCount(F feature, C category)
	{
		CategoryEntry<F,C> catEntry = this.trainingData.getData().get(category);
		if (catEntry != null)
		{
			Map<F, Integer> feat = catEntry.getFeatures();
			if (feat == null)
				return 0;
			Integer num = feat.get(feature);
			if (num != null)
				return num;
		}
		return 0;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	//                               P R O B A B I L I T Y    S E C T I O N
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * <p>Calculates the a-priori probability for a certain category.</p>
	 * <p>It therefore counts all entries labeled with this category and
	 * divides the sum through the total number of entries.</p>
	 * 
	 * @param category The category whose probability should be calculated
	 * @return The probability of a certain category
	 */
	public double getCategoryProbability(C category)
	{
		// P(C) = number of items in category / total number in all categories
		if (this.catProb.get(category) == null)
			this.catProb.put(category, (double)this.getNumberOfSamplesForCategory(category) 
					/ this.getTotalNumberOfSamples());
		if (logger.isDebugEnabled())
			logger.debug("   P('"+category+"') = "+this.getNumberOfSamplesForCategory(category)+
					"/"+this.getTotalNumberOfSamples()+" = "+this.catProb.get(category));
		return this.catProb.get(category);
	}
	
	/**
	 * <p>Calculates the probability for a certain feature.</p>
	 * <p>This method runs through every defined category and sums up the 
	 * conditional probability of the feature given the category <em>P(X|C)</em> 
	 * times the probability of the category <em>P(C)</em> itself.</p>
	 * 
	 * @param feature The feature whose probability should be calculated
	 * @return The probability of a certain feature
	 */
	public double getFeatureProbability(F feature)
	{
		// P(F) = P(F|C1)*P(C1) + ... + P(F|Cn)*P(Cn)
		String output = null;
		if (logger.isDebugEnabled())
			output = "   P('"+feature+"') = ";
		double p = 0;
		// Runs through every defined category
		// and sums up the conditional probability P(X|C) times the probability of the category P(C)
		for (C category : this.trainingData.getData().keySet())
		{
			if (logger.isDebugEnabled())
				output += "P('"+feature+"'|'"+category+"')*P('"+category+"') + ";
			p += this.getConditionalProbability(feature, category) * this.getCategoryProbability(category);
		}
		if (logger.isDebugEnabled())
			logger.debug(output.substring(0,output.length()-3)+": "+p);
		return p;
	}
	
	/**
	 * <p>Calculates the probability for a certain set of features.</p>
	 * 
	 * @param feature The feature whose probability should be calculated
	 * @return The combined probability of the provided features
	 */
	public double getFeatureProbability(F[] features)
	{
		// P(F1,F2) = P(F1|C1)*P(F2|C1)*P(C1) + P(F1|C2)*P(F2|C2)*P(C2) + ... + P(F1|Cn)*P(F2|Cn)*P(Cn)
		double p = 0;
		for (C category : this.trainingData.getData().keySet())
		{
			double _p = this.getCategoryProbability(category);
			for (F feature : features)
			{
				_p *= this.getConditionalProbability(feature, category);
			}
			p += _p;
		}
		return p;
	}
	
	/**
	 * <p>Calculates the weighted Probability for a certain feature.</p>
	 * <p>This method runs through every defined category and sums up the 
	 * conditional probability of the feature given the category <em>P(X|C)</em> 
	 * times the probability of the category <em>P(C)</em> itself.</p>
	 * 
	 * @param feature The feature whose probability should be calculated
	 * @return The probability of a certain feature
	 */
	public double getFeatureProbabilityWeighted(F feature)
	{
		// P(F) = P(F|C1)*P(C1) + ... + P(F|Cn)*P(Cn)
		double p = 0;
		// Runs through every defined category
		// and sums up the conditional probability P(X|C) times the probability of the category P(C)
		for (C category : this.trainingData.getData().keySet())
			p += this.getConditionalProbabilityWeighted(feature, category) * this.getCategoryProbability(category);
		return p;
	}
	
	/**
	 * <p>Calculates the weighted Probability for a certain set of features.</p>
	 * 
	 * @param feature The feature whose probability should be calculated
	 * @return The probability of a certain feature
	 */
	public double getFeatureProbabilityWeighted(F[] features)
	{
		// P(F1,F2) = P(F1|C1)*P(F2|C1)*P(C1) + ... + P(F1|Cn)*P(F2|Cn)*P(Cn)
		double p = 0;
		for (C category : this.trainingData.getData().keySet())
		{
			double _p = this.getCategoryProbability(category);
			for (F feature : features)
			{
				_p *= this.getConditionalProbabilityWeighted(feature, category);
			}
			p += _p;
		}
		return p;
	}
	
	/**
	 * <p>Returns the conditional probability of a word given its 
	 * classification-category <em>[Pr(word|classification)]</em>.</p>
	 * <p>This method allows passing an additional argument, the <em>smoothingPrior</em>
	 * which prevents zero probabilities in further computations. A <em>smoothingPrior</em>
	 * of 0 does not affect the outcome while a <em>smoothingPrior</em> between
	 * 0 and 1 is called a Lidstone smoothing while a <em>smoothingPrior</em> of
	 * 1 is called a Laplace smoothing.</p>
	 * 
	 * @param feature Feature or word the probability should be calculated for
	 * @param category The category the feature/word have to be in
	 * @param smoothingPrior accounts for features not present in the learning 
	 *                       samples and prevents zero probabilities in further 
	 *                       computations
	 * @return The probability of the feature given its category
	 */
	public double getConditionalProbability(F feature, C category, double smoothingPrior)
	{
		// P(F|C)
		String output = null;
		if (logger.isDebugEnabled())
			output = "   P('"+feature+"'|'"+category+"') = ";
		long samplesForCategory = this.getNumberOfSamplesForCategory(category);
		if (samplesForCategory == 0)
			return 0.;
		// The total number of times this feature appeared in this
		// category divided by the total number of items in this category
		// application of the multinomial event model
		int featCount = this.getFeatureCount(feature, category);
		double result = ((double)featCount+smoothingPrior)/(samplesForCategory+smoothingPrior*this.getTotalNumberOfFeatures());
		if (logger.isDebugEnabled())
			logger.debug(output+featCount+"/"+samplesForCategory+" = "+result);
		return result;
	}
	
	/**
	 * <p>Returns the conditional probability of a word given its 
	 * classification-category <em>[Pr(word|classification)]</em>.</p>
	 * 
	 * @param feature Feature or word the probability should be calculated for
	 * @param category The category the feature/word have to be in
	 * @return The probability of the feature given its category
	 */
	public double getConditionalProbability(F feature, C category)
	{
		// P(F|C)
		String output = null;
		if (logger.isDebugEnabled())
			output = "   P('"+feature+"'|'"+category+"') = ";
		long samplesForCategory = this.getNumberOfSamplesForCategory(category);
		if (samplesForCategory == 0)
			return 0.;
		// The total number of times this feature appeared in this
		// category divided by the total number of items in this category
		int featCount = this.getFeatureCount(feature, category);
		double result = (double)featCount/samplesForCategory;
		if (logger.isDebugEnabled())
			logger.debug(output+featCount+"/"+samplesForCategory+" = "+result);
		return result;
	}
	
	/**
	 * <p>Returns the conditional probability for words given their 
	 * classification-category <em>[Pr(word1,word2|classification)]</em>.</p>
	 * <p>This method allows passing an additional argument, the <em>smoothingPrior</em>
	 * which prevents zero probabilities in further computations. A <em>smoothingPrior</em>
	 * of 0 does not affect the outcome while a <em>smoothingPrior</em> between
	 * 0 and 1 is called a Lidstone smoothing while a <em>smoothingPrior</em> of
	 * 1 is called a Laplace smoothing.</p>
	 * 
	 * @param features Features or words the probability should be calculated for
	 * @param category The category the features/words have to be in
	 * @param smoothingPrior accounts for features not present in the learning 
	 *                       samples and prevents zero probabilities in further 
	 *                       computations
	 * @return The probability of the features given their category
	 */
	public double getConditionalProbability(F[] features, C category, double smoothingPrior)
	{
		// http://en.wikipedia.org/wiki/Naive_Bayes_classifier
		// P(F1,F2|C) = P(F1|C)*P(F2|C,F1) but as F1 and F2 are statistically 
		//                                 independent (naive assumption)
		//              P(F1|C)*P(F2|C)
		String output = null;
		if (logger.isDebugEnabled())
		{
			output = "   P(";
			for (F feature : features)
				output += "'"+feature+"',";
			output = output.substring(0, output.length()-1);
			output += "|'"+category+"') = ";
		}
		double prob = 1;
		for (F feature : features)
			prob *= this.getConditionalProbability(feature, category, smoothingPrior);
		if (logger.isDebugEnabled())
			logger.debug(output+prob);
		return prob;
	}
	
	/**
	 * <p>Returns the conditional probability for words given their 
	 * classification-category <em>[Pr(word1,word2|classification)]</em>.</p>
	 * 
	 * @param features Features or words the probability should be calculated for
	 * @param category The category the features/words have to be in
	 * @return The probability of the features given their category
	 */
	public double getConditionalProbability(F[] features, C category)
	{
		// http://en.wikipedia.org/wiki/Naive_Bayes_classifier
		// P(F1,F2|C) = P(F1|C)*P(F2|C,F1) but as F1 and F2 are statistically 
		//                                 independent (naive assumption)
		//              P(F1|C)*P(F2|C)
		String output = null;
		if (logger.isDebugEnabled())
		{
			output = "   P(";
			for (F feature : features)
				output += "'"+feature+"',";
			output = output.substring(0, output.length()-1);
			output += "|'"+category+"') = ";
		}
		double prob = 1;
		for (F feature : features)
			prob *= this.getConditionalProbability(feature, category);
		if (logger.isDebugEnabled())
			logger.debug(output+prob);
		return prob;
	}
	
	/**
	 * <p>As probabilities may behave extreme on small sample data (f.e. only a 
	 * single occurrence of a word yields either a total agreement or a total 
	 * rejection for a certain class) or on features that occur rarely in 
	 * training examples, assumed probabilities are used to soften the effect on
	 * small data or rare features.<p>
	 * <p>The idea behind assumed probabilities is to grant a feature the same 
	 * chance to be within every category from the start on and move it towards 
	 * a certain category through training. For a classifier containing two 
	 * categories 0.5 is a good assumed probability.</p>
	 * <p>Moreover a weight can be introduced to increase the importance of 
	 * certain features. A weight of 1 gives the assumed probability the same 
	 * weight as one word.</p>
	 * 
	 * @param feature Feature or word the probability should be calculated for
	 * @param category The category the feature/word have to be in
	 * @param weight The weight of the assumed probability to take influence
	 *               on the importance of a certain feature. A weight of 1
	 *               means it has the same weight as one word.
	 * @param assumedProb The assumed probability of a feature if this 
	 *                    feature has not yet been seen before. Typically
	 *                    this parameter is set to 0.5 for a two-sided
	 *                    category like 'in' and 'out' or 'good' and 'bad'
	 *                    as this feature should be equally possible to be
	 *                    in either of these categories
	 * @return The weighted probability of a feature given a certain category
	 */
	public double getConditionalProbabilityWeighted(F feature, C category, double weight, double assumedProb)
	{
		// P(F|C)
		// 
		// (weight*assumeProb + count*condProb) / (count+weight)
		//
		// Count the number of times this feature has appeared in all categories
		long count = this.getFeatureCount(feature);
		double condProb = this.getConditionalProbability(feature, category);
		double prob = (weight*assumedProb + count*condProb) / (count+weight);
		if (logger.isDebugEnabled())
			logger.debug("   wP('"+feature+"'|'"+category+"') = (weight="+weight+"*assumedProb="+assumedProb+" + count="+count+"*condProb="+condProb+") / (count="+count+"+weight="+weight+") = "+prob);
		return prob;
	}

	/**
	 * <p>As probabilities may behave extreme on small sample data (f.e. only a 
	 * single occurrence of a word yields either a total agreement or a total 
	 * rejection for a certain class) or on features that occur rarely in 
	 * training examples, assumed probabilities are used to soften the effect on
	 * small data or rare features.<p>
	 * <p>The idea behind assumed probabilities is to grant a feature the same 
	 * chance to be within every category from the start on and move it towards 
	 * a certain category through training. This method assigns a base 
	 * probability of 1/'numbers of categories' to every feature.</p>
	 * <p>Moreover a weight can be introduced to increase the importance of 
	 * certain features. This method assigns a weight of 1 to the assumed 
	 * probability which gives it the same weight as one word.</p>
	 * 
	 * @param feature Feature or word the probability should be calculated for
	 * @param category The category the feature/word have to be in
	 * @return The weighted probability of a feature given a certain category
	 */
	public double getConditionalProbabilityWeighted(F feature, C category)
	{
		// P(F|C)
		return this.getConditionalProbabilityWeighted(feature, category, 1.0, 1./this.getNumberOfCategories());
	}
	
	/**
	 * <p>Calculates the conditional probability of multiple features given 
	 * their category - <em>Pr(feature1, feature2|category)</em>.</p>
	 * <p>This is where NaiveBayes does derive its name from as items (e.g. 
	 * words) are naively considered to be independent form each other which in 
	 * reality is not quite true.</p>
	 * <p>It therefore multiplies the weighted probabilities for each feature
	 * contained in item with the provided category.</p>
	 * 
	 * @param features List of features whose conditional probability for a 
	 *                 certain given category should be calculated
	 * @param category The category used to calculate the probability for 
	 *                 the needed features
	 * @param weight The weight of the assumed probability to take influence
	 *               on the importance of a certain feature. A weight of 1
	 *               means it has the same weight as one word.
	 * @param assumedProb The assumed probability of a feature if this 
	 *                    feature has not yet been seen before. Typically
	 *                    this parameter is set to 0.5 for a two-sided
	 *                    category like 'in' and 'out' or 'good' and 'bad'
	 *                    as this feature should be equally possible to be
	 *                    in either of these categories
	 * @return The conditional probability <em>P(X,Y|C)</em> of all the features 
	 *         given their category
	 */
	public double getConditionalProbabilityWeighted(F[] features, C category, double weight, double assumedProb)
	{
		// P(F1,F2|C) = P(F1|C)*P(F2|C)
		// Multiply the probabilities of all the features together
		double p = 1.0;
		for (F feature : features)
		{
			if (this.trainingData.getData().get(category).getFeatures().containsKey(feature))
				p *= this.getConditionalProbabilityWeighted(feature, category, weight, assumedProb);
			else
				p *= 1./this.getNumberOfCategories();
		}
		return p;
	}
	
	/**
	 * <p>Calculates the conditional probability of multiple features given 
	 * their category - <em>Pr(feature1, feature2|category)</em>.</p>
	 * <p>This is where NaiveBayes does derive its name from as items (e.g. 
	 * words) are naively considered to be independent form each other which in 
	 * reality is not quite true.</p>
	 * <p>It therefore multiplies the weighted probabilities for each feature
	 * contained in item with the provided category.</p>
	 * 
	 * @param features List of features whose conditional probability 
	 *                 for a certain given category should be calculated
	 * @param category The category used to calculate the probability for 
	 *                 the needed features
	 * @return The conditional probability <em>P(X,Y|C)</em> of all the features 
	 *         given their category
	 */
	public double getConditionalProbabilityWeighted(F[] features, C category)
	{
		// P(F1,F2|C) = P(F1|C)*P(F2|C)
		// Multiply the probabilities of all the features together
		double p = 1.0;
		for (F s : features)
			p *= this.getConditionalProbabilityWeighted(s, category);
		return p;
	}
	
	@Override
	public double getProbability(C category, F item)
	{
		// given a specific word (f.e. 'money'), what's the probability that it fits into a specific category (f.e. 'good')
		// P('good'|'money') = [P('money'|'good')*P('good')]/P('money')
		//
		// given a specific document, what's the probability that it fits into this category
		// P(Category|Document) = P(Document|Category)*P(Category)/P(Document)
		//
		// Further P(F) = P(F|C1) + ... + P(F|Cn)
		//
		// P(C|F) = [P(F|C)*P(C)]/P(F)		
		if (this.trainingData.getData().containsKey(category))
		{
			double catProb = this.getCategoryProbability(category);
			double condProb = this.getConditionalProbability(item, category);
			double featProb = this.getFeatureProbability(item);

			if (featProb == 0)
				return 0.;
			return condProb*catProb / featProb;
		}
		else
		{
			// we have never seen this concept before
			return 0.;
		}
	}
	
	@Override
	public double getProbability(C category, F[] items)
	{
		// http://en.wikipedia.org/wiki/Naive_Bayes_classifier
		// given specific words, what's the probability that they fit into this category
		// P('good'|'money', 'casino') = P('money','casino'|'good')*P('good') / P('money','casino') 
		//                             = P('money','casino'|'good')*P('good') / 
		//                                 [P('money'|'good')*P('casino'|'good')*P('good') +
		//                                  P('money'|'bad')*P('casino'|'bad')*P('bad')]
		//
		// P(C|F1,F2) = [P(F1,F2|C)*P(C)] / P(F1, F2)			
		if (this.trainingData.getData().containsKey(category))
		{
			double catProb = this.getCategoryProbability(category);
			double condProb = this.getConditionalProbability(items, category);
			double featProb = this.getFeatureProbability(items);
			
			if (featProb == 0)
				return 0.;
			return condProb*catProb / featProb;
		}
		else
		{
			// we haven't seen this category yet
			return 0.;
		}
	}
	
	@Override
	public double getProbability_EvenLikelihood(C category, F item)
	{
		if (this.getFeatureCount(item)==0)
			return 0.5;
		
		return this.getProbability(category, item);
	}
	
	@Override
	public double getSmoothedProbability(C category, F item, double smoothingPrior)
	{
		// given a specific word (f.e. 'money'), what's the probability that it fits into a specific category (f.e. 'good')
		// P('good'|'money') = [P('money'|'good')*P('good')]/P('money')
		//
		// given a specific document, what's the probability that it fits into this category
		// P(Category|Document) = P(Document|Category)*P(Category)/P(Document)
		//
		// Further P(F) = P(F|C1) + ... + P(F|Cn)
		//
		// P(C|F) = [P(F|C)*P(C)]/P(F)
		if (this.trainingData.getData().containsKey(category))
		{
			double catProb = this.getCategoryProbability(category);
			double condProb = this.getConditionalProbability(item, category, smoothingPrior);
			double featProb = this.getFeatureProbability(item);

			if (featProb == 0)
				return 0;
			return condProb*catProb / featProb;
		}
		else
		{
			// we have never seen this concept before
			return 0;
		}
	}
	
	@Override
	public double getSmoothedProbability(C category, F[] items, double smoothingPrior)
	{
		// http://en.wikipedia.org/wiki/Naive_Bayes_classifier
		// given specific words, what's the probability that they fit into this category
		// P('good'|'money', 'casino') = P('money','casino'|'good')*P('good') / P('money','casino') 
		//                             = P('money','casino'|'good')*P('good') / 
		//                                 [P('money'|'good')*P('casino'|'good')*P('good') +
		//                                  P('money'|'bad')*P('casino'|'bad')*P('bad')]
		//
		// P(C|F1,F2) = [P(F1,F2|C)*P(C)] / P(F1, F2)
		if (this.trainingData.getData().containsKey(category))
		{
			double catProb = this.getCategoryProbability(category);
			double condProb = this.getConditionalProbability(items, category, smoothingPrior);
			double featProb = this.getFeatureProbability(items);
			
			if (featProb == 0)
				return 0;
			return condProb*catProb / featProb;
		}
		else
		{
			// we haven't seen this category yet
			return 0;
		}
	}
	
	@Override
	public double getWeightedProbability(C category, F item)
	{
		// given specific word, what's the probability that it fits into this category
		// wP('good'|'money') = [wP('money'|'good')*P('good')] / wP('money') 
		//                    = [wP('money'|'good')*P('good')] / 
		//                        [wP('money'|'good')*P('good') + wP('money'|'bad')*P('bad')]
		//
		// wP(C|F) = [wP(F|C)*P(C)] / wP(F)
		if (this.trainingData.getData().containsKey(category))
		{
			double catProb = this.getCategoryProbability(category);
			double condProb = this.getConditionalProbabilityWeighted(item, category);
			double featProb = this.getFeatureProbabilityWeighted(item);

			if (featProb == 0)
				return 1./this.getNumberOfCategories();
			return condProb*catProb / featProb;
		}
		else
		{
			// we haven't seen this category yet
			return 1./this.getNumberOfCategories();
		}
	}
	
	@Override
	public double getWeightedProbability(C category, F[] items)
	{
		// given specific words, what's the probability that they fit into this category
		// wP('good'|'money', 'casino') = [wP('money','casino'|'good')*P('good')] / wP('money','casino') 
		//                              = [wP('money'|'good')*P('casino'|'good')*P('good')] / 
		//                                  [wP('money'|'good')*wP('casino'|'good')*P('good') +
		//                                   wP('money'|'bad')*wP('casino'|'bad')*P('bad')]
		//
		// wP(C|F1,F2) = [wP(F1,F2|C)*P(C)] / wP(F1, F2)
		if (this.trainingData.getData().containsKey(category))
		{
			// probability for a certain category
			double catProb = this.getCategoryProbability(category);
			double condProb = this.getConditionalProbabilityWeighted(items, category);
			double featProb = this.getFeatureProbabilityWeighted(items);

			if (featProb == 0)
				return 1./this.getNumberOfCategories();
			return condProb*catProb / featProb;
		}
		else
		{
			// we haven't seen this category yet
			return 1./this.getNumberOfCategories();
		}
	}
	

	@Override
	public void train(F item, C category)
	{
		if (this.trainingData == null)
			this.trainingData = new NBTrainingData<F,C>();
		// increment the count for every feature with this category
		this.trainingData.incrementFeature(item, category);
		this.trainingData.incrementNumberOfSamplesForCategory(category);
	}
	
	@Override
	public void train(F[] items, C category)
	{
		if (this.trainingData == null)
			this.trainingData = new NBTrainingData<F,C>();
		for (F item : items)
			this.trainingData.incrementFeature(item, category);
		this.trainingData.incrementNumberOfSamplesForCategory(category);
	}
	
	@Override
	public void train(List<F> items, C category)
	{
		if (this.trainingData == null)
			this.trainingData = new NBTrainingData<F,C>();
		for (F item : items)
			this.trainingData.incrementFeature(item, category);
		this.trainingData.incrementNumberOfSamplesForCategory(category);
	}
	
	@Override
	public C classify(F item)
	{
		Map<C, Double> probs = new Hashtable<C, Double>();
		// find the category with the highest probability
		double max = 0.0f;
		C best = null;
		for (C cat : this.trainingData.getData().keySet())
		{
			probs.put(cat, this.getWeightedProbability(cat, item));
			if (probs.get(cat) > max)
			{
				max = probs.get(cat);
				best = cat;
			}
		}
		
		// Make sure the probability exceeds threshold*next best
		for (C cat : probs.keySet())
		{
			if (cat==best) 
				continue;
			if (probs.get(cat)*this.getThreshold(best)>probs.get(best))
				return null;
		}
		return best;
	}
	
	@Override
	public C classify(F[] items)
	{
		Map<C, Double> probs = new Hashtable<C, Double>();
		// find the category with the highest probability
		double max = 0.0f;
		C best = null;
		for (C cat : this.trainingData.getData().keySet())
		{
			probs.put(cat, this.getWeightedProbability(cat, items));
			if (probs.get(cat) > max)
			{
				max = probs.get(cat);
				best = cat;
			}
		}
		
		// Make sure the probability exceeds threshold*next best
		for (C cat : probs.keySet())
		{
			if (cat==best) 
				continue;
			if (probs.get(cat)*this.getThreshold(best)>probs.get(best))
				return null;
		}
		return best;
	}
}
