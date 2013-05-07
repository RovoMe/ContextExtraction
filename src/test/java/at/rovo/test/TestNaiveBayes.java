package at.rovo.test;

import static org.junit.Assert.*;
import junit.framework.Assert;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import at.rovo.classifier.NaiveBayes;

public class TestNaiveBayes extends NaiveBayes<String, String>
{
	private static Logger logger = LogManager.getLogger(TestNaiveBayes.class.getName());
	
	@Before
	public void sampleTrain()
	{	
		String[] items = "Nobody owns the water".split("\\W");
		this.train(items, "good");
		items = "the quick rabbit jumps fences".split("\\W");
		this.train(items, "good");
		items = "buy pharmaceuticals now".split("\\W");
		this.train(items, "bad");
		items = "make quick money at the online casino".split("\\W");
		this.train(items, "bad");
		items = "the quick brown fox jumps".split("\\W");
		this.train(items, "good");
	}
	
	@Test
	public void testCategoryCount()
	{
		long catCount = this.getNumberOfSamplesForCategory("good");
		logger.debug("Category 'good' contained in examples: "+catCount);
		// 3 sentences are labled as good
		Assert.assertEquals(3L, catCount);
		
		catCount = this.getNumberOfSamplesForCategory("bad");
		logger.debug("Category 'bad' contained in examples: "+catCount);
		// 2 sentences are labled as bad
		Assert.assertEquals(2L, catCount);
		
		catCount = this.getNumberOfSamplesForCategory("notInThere");
		logger.debug("Category 'notInThere' contained in examples: "+catCount);
		// 0 sentences are labled as notInThere
		Assert.assertEquals(0L, catCount);
	}
	
	@Test
	public void testFeatureCount() 
	{
		long featCount = this.getFeatureCount("quick", "good");
		logger.debug("Feature 'quick' containd in 'good' examples: "+ featCount);
		// 2 sentences labeled as good contain quick
		Assert.assertEquals(2L, featCount);
		
		featCount = this.getFeatureCount("quick", "bad");
		logger.debug("Feature 'quick' containd in 'bad' examples: "+ featCount);
		// only 1 sentence labeled as bad contains quick
		Assert.assertEquals(1L, featCount);
		
		featCount = this.getFeatureCount("notInThere", "good");
		logger.debug("Feature 'notInThere' contained in 'good' examples: "+featCount);
		// 0 sentences labeled as good contain notInThere
		Assert.assertEquals(0L, featCount);
		
		featCount = this.getFeatureCount("notInThere", "bad");
		logger.debug("Feature 'notInThere' contained in 'bad' examples: "+featCount);
		// 0 sentences labeled as good contain notInThere
		Assert.assertEquals(0L, featCount);
		
		featCount = this.getFeatureCount("notInThere", "noCategory");
		logger.debug("Feature 'notInThere' contained in 'noCategory' examples: "+featCount);
		// 0 sentences labeled as good contain notInThere
		Assert.assertEquals(0L, featCount);
	}
	
	@Test
	public void testAbsoluteCount()
	{		
		long totalCount = this.getTotalNumberOfSamples();
		logger.debug("Total count: "+totalCount);
		// there are exactly 5 test entries
		Assert.assertEquals(5L, totalCount);
	}
	
	@Test
	public void testFeatureProbability()
	{	
		// 'quick' occurred in 3 out of 5 examples
		double p = this.getFeatureProbability("quick");
		logger.debug("P('quick'): "+p);
		Assert.assertEquals(3./5, p);
		
		// 'money' occurred in 1 out of 5 examples
		p = this.getFeatureProbability("money");
		logger.debug("P('money'): "+ p);
		Assert.assertEquals(1./5, p);
		
		// 'jumps' occurred in 2 out of 5 examples
		p = this.getFeatureProbability("jumps");
		logger.debug("P('jumps'): "+ p);
		Assert.assertEquals(2./5, p, 0.000001);
		
		// 'notInThere' occurred in 0 out of 5 examples
		p = this.getFeatureProbability("notInThere");
		logger.debug("P('notInThere'): "+ p);
		Assert.assertEquals(0./5, p);
		
		p = this.getFeatureProbability("quick money".split("\\W"));
		logger.debug("P('quick','money'): "+p);
		// P('quick','money') = P('quick'|'good')*P('money'|'good')*P('good') + 
		//                      P('quick'|'bad')*P('money'|'bad')*P('bad')
		// P('quick'|'good') = 2/3 - 2 out of 3 samples labeled as 'good' contain quick
		// P('quick'|'bad') =  1/2 - 1 out of 2 samples labeled as 'bad' contain quick
		// P('money'|'good') = 0/3 - 'money' does not occur in 'good' samples
		// P('money'|'bad') = 1/2  - 'money' is contained in 1 'bad' examples 
		// P('good') = 3/5 - 3 out of 5 samples are labeled as 'good'
		// P('bad') = 2/5 - 2 out of 5 samples are labeled as 'bad'
		//
		// [(2/3)*(0/3)*(3/5)+(1/2)*(1/2)*(2/5)] = 0.1
		Assert.assertEquals(0.1, p);
		
		p = this.getFeatureProbability("quick notInThere".split("\\W"));
		logger.debug("P('quick','notInThere'): "+p);
		
		// P('quick','notInThere') = P('quick'|'good')*P('notInThere'|'good')*P('good') + 
		//                           P('quick'|'bad')*P('notInThere'|'bad')*P('bad')
		// ...
		// P('notInThere'|'good') = 0/3
		// P('notInThere'|'bad') = 0/2
		//
		// [(2/3)*(0/3)*(3/5)+(1/2)*(0/2)*(2/5)] = 0
		Assert.assertEquals(0., p);
		
		p = this.getFeatureProbability("quick rabbit".split("\\W"));
		logger.debug("P('quick','rabbit'): "+p);
		// P('quick', 'rabbit') = P('quick'|'good')*P('rabbit'|'good')*P('good') +
		//                        P('quick'|'bad')*P('rabbit'|'bad')*P('bad')
		// P('quick'|'good') = 2/3 - 2 out of 3 samples labeled as 'good' contain 'quick'
		// P('quick'|'bad') =  1/2 - 1 out of 2 samples labeled as 'bad' contain 'quick'
		// P('rabbit'|'good') = 1/3 - 'rabbit' is contained in 1 good samples
		// P('rabbit'|'bad') = 0/2  - 'rabbit' does not occur in bad samples 
		//
		// P('good') = 3/5 - 3 out of 5 samples are labeled as 'good'
		// P('bad') = 2/5 - 2 out of 5 samples are labeled as 'bad'
		//
		// [(2/3)*(1/3)*(3/5)+(1/2)*(0/2)*(2/5)] = 0.133333333333
		Assert.assertEquals(0.1333333333333333, p);
	}
	
	@Test
	public void testConditionalProbabilities()
	{	
		double featProb = this.getConditionalProbability("quick", "good");
		logger.debug("P('quick'|'good'): " + featProb);
		// 'quick' is included in 2 of the 3 training sets which have been labeled as good
		Assert.assertEquals(2.0/3.0, featProb);
		
		featProb = this.getConditionalProbability("quick", "bad");
		logger.debug("P('quick'|'bad'): " + featProb);
		// 'quick' is included in 1 of the 2 training sets which have been labeled as bad
		Assert.assertEquals(1.0/2.0, featProb);
		
		featProb = this.getConditionalProbability("jumps", "good");
		logger.debug("P('jumps'|'good'): " + featProb);
		// 'jumps' is included in 2 of the 3 training sets which have been labeled as good
		Assert.assertEquals(2.0/3.0, featProb);
		
		featProb = this.getConditionalProbability("jumps", "bad");
		logger.debug("P('jumps'|'bad'): " + featProb);
		// 'jumps' is included in 0 of the 2 training sets which have been labeled as bad
		Assert.assertEquals(0.0/2.0, featProb);
		
		featProb = this.getConditionalProbability("notInThere", "good");
		logger.debug("P('notInThere'|'good'): " + featProb);
		// 'notInThere' is included in 0 of the 3 training sets which have been labeled as good
		Assert.assertEquals(0.0/3.0, featProb);
		
		featProb = this.getConditionalProbability("notInThere", "bad");
		logger.debug("P('notInThere'|'bad'): " + featProb);
		// 'notInThere' is included in 0 of the 2 training sets which have been labeled as bad
		Assert.assertEquals(0.0/2.0, featProb);
		
		featProb = this.getConditionalProbability("quick", "unsure");
		logger.debug("P('quick'|'unsure'): " + featProb);
		// 'quick' is included in 0 of the 0 training sets which have been labeled as unsure
		Assert.assertEquals(0.0, featProb);
		
		featProb = this.getConditionalProbability("quick money".split("\\W"), "good");
		logger.debug("P('quick','money'|'bad'): "+featProb);
		Assert.assertEquals((2./3.)*(0./3.), featProb);
		
		featProb = this.getConditionalProbability("quick money".split("\\W"), "bad");
		logger.debug("P('quick','money'|'bad'): "+featProb);
		Assert.assertEquals((1./2.)*(1./2.), featProb);
		
		featProb = this.getConditionalProbability("quick notInThere".split("\\W"), "bad");
		logger.debug("P('quick','notInThere'|'bad'): "+featProb);
		Assert.assertEquals((1./2.)*(0./2.), featProb);
	}
	
	@Test
	public void testConditionalProbabilityWeighted()
	{
		// P(X|C)
		double wP = this.getConditionalProbabilityWeighted("quick", "good");
		logger.debug("wP('quick'|'good'): "+wP);
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// 'quick' is in 3 of those 5 example sentences --> count = 3
		// 'quick' is included in 2 of 3 sentence labeled as 'good' --> 2/3
		//
		// (1*0.5+3*2/3) / (3+1) = 0.625
		Assert.assertEquals(0.625, wP);
		
		wP = this.getConditionalProbabilityWeighted("quick", "bad");
		logger.debug("wP('quick'|'bad'): "+wP);
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// 'quick' is in 3 of those 5 example sentences --> count = 3
		// 'quick' is included in 1 of 3 sentence labeled as 'bad' --> 1/2
		//
		// (1*0.5+3*1/2) / (3+1) = 0.5
		Assert.assertEquals(0.5, wP);
		
		wP = this.getConditionalProbabilityWeighted("jumps", "good");
		logger.debug("wP('jumps'|'good'): "+wP);
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// 'jumps' is in 2 of those 5 example sentences --> count = 2
		// 'jumps' is included in 2 of 3 sentence labeled as 'good' --> 2/3
		//
		// (1*0.5+2*2/3) / (2+1) = 0.6111111111
		Assert.assertEquals(0.611111111, wP, 0.0000001);
		
		wP = this.getConditionalProbabilityWeighted("jumps", "bad");
		logger.debug("wP('jumps'|'bad'): "+wP);
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// 'quick' is in 3 of those 5 example sentences --> count = 3
		// 'quick' is included in 0 of 3 sentence labeled as 'bad' --> 0
		//
		// (1*0.5+2*0) / (2+1) = 1/6 = 0.166666667
		Assert.assertEquals(1./6, wP);
		
		wP = this.getConditionalProbabilityWeighted("notInThere", "good");
		logger.debug("wP('notInThere'|'good'): "+wP);
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// 'notInThere' is in 0 of those 5 example sentences --> count = 0
		// 'notInThere' is included in 0 of 3 sentence labeled as 'good' --> 0/3
		//
		// (1*0.5+0*0/3) / (0+1) = 0.5
		Assert.assertEquals(0.5, wP);
		
		wP = this.getConditionalProbabilityWeighted("quick", "notExisting");
		logger.debug("wP('quick'|'notExisting'): "+wP);
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// 'quick' is in 3 of those 5 example sentences --> count = 3
		// 'quick' is included in 0 of 0 sentence labeled as 'notExisting' --> 0/0
		//
		// (1*0.5+3*0) / (3+1) = 0.125
		Assert.assertEquals(0.125, wP);
		
		wP = this.getConditionalProbabilityWeighted("money", "good");
		logger.debug("wP('money'|'good'): " + wP);
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// money is only in 1 of those 5 example sentences --> count = 1
		// money is not included in any sentence labeled as good --> 0/3 = 0
		//
		// (1*0.5+1*0)/(1+1) = 0.25
		Assert.assertEquals(0.25, wP);
		
		this.sampleTrain();
		wP = this.getConditionalProbabilityWeighted("money", "good");
		logger.debug("Weighted probability for 'money' in 'good' examples after further sample training: " +wP);
		// After train of the same samples again - we have now
		// * 10 sentences - 6 labeled as good, 4 as bad
		// * 2 sentences contain money - 0 labeled as good, 2 as bad
		//
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// money is only in 2 of those 10 example sentences --> count = 2
		// money is not included in any sentence labeled as good --> 0/6 = 0
		//
		// (1*0.5+2*0)/(2+1) = 1/6 = 0.16666..
		Assert.assertEquals(1./6, wP);
	}	
	
	@Test
	public void testConditionalProbabilityWeighted2()
	{
		// P(X,Y|C)
		double wP = this.getConditionalProbabilityWeighted("quick money".split("\\W"), "good");
		logger.debug("wP('quick','money'|'good'): "+wP);
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// 'quick' is in 3 of those 5 example sentences --> count = 3
		// 'quick' is included in 2 of 3 sentence labeled as 'good' --> 2/3
		// 'money' is in 1 of those 5 example sentences --> count = 1
		// 'money' is included in 0 of 3 sentences labeled as 'good' --> 0/3
		// p = wP('quick', 'good') * wP('money', 'good')
		//
		// (1*0.5+3*(2/3))/(3+1) * (1*0.5+1*(0/3))/(1+1) = 0.625 * 0.25 = 0.15625
		Assert.assertEquals(0.15625, wP);
		
		wP = this.getConditionalProbabilityWeighted("quick money".split("\\W"), "bad");
		logger.debug("wP('quick','money'|'bad'): "+wP);
		// (weight*assumeProb + count*featProb) / (count+weight)
		// (1*0.5+count*featProb) / (count+1)
		// 'quick' is in 3 of those 5 example sentences --> count = 3
		// 'quick' is included in 1 of 5 sentence labeled as 'bad' --> 1/2
		// 'money' is in 1 of those 5 example sentences --> count = 1
		// 'money' is included in 1 of 2 sentences labeled as 'bad' --> 1/2
		// p = wP('quick', 'bad') * wP('money', 'bad')
		//
		// (1*0.5+3*(1/2))/(3+1) * (1*0.5+1*(1/2))/(1+1) = 0.5 * 0.5 = 0.25
		Assert.assertEquals(0.25, wP);
	}
	
	@Test
	public void testCategoryProbability()
	{
		// P(C)
		double catProb = this.getCategoryProbability("good");
		logger.debug("Probability of category 'good': "+catProb);
		// category count / total count
		assertEquals(new Double(3./5.), new Double(catProb));
		
		catProb = this.getCategoryProbability("bad");
		logger.debug("Probability of category 'good': "+catProb);
		// category count / total count
		assertEquals(new Double(2./5.), new Double(catProb));
		
		catProb = this.getCategoryProbability("notInThere");
		logger.debug("Probability of category 'good': "+catProb);
		// category count / total count
		assertEquals(new Double(0), new Double(catProb));
	}

	
	@Test
	public void testProbability()
	{	
		// quick has 2 occurrences in good examples and total 3 occurrences
		double p = this.getProbability("good", "quick");
		logger.debug("nb-P('good'|'quick'): "+p);
		Assert.assertEquals(2./3, p);
		
		// quick has 1 occurrence in bad examples and total 3 occurrences
		p = this.getProbability("bad", "quick");
		logger.debug("nb-P('bad'|'quick'): "+p);
		Assert.assertEquals(1./3, p, 0.00005); // rounding-difference - result is: 0.33333333333333337
		
		// P(C|F) = P(F|C)*P(C)/P(F)
		//        = P(F|C)*P(C)/(P(F|C1)*P(C1)+...+P(F|Cn)*P(Cn))
		//        = P('notInThere'|'good')*P('good')/[P('notInThere'|'good')*P('good')+P('notInThere'|'bad')*P('bad')]
		// P('notInThere'|'good') = 0/3
		// P('good') = 3/5
		// P('notInThere'|'bad') = 0/2
		// P('bad') = 2/5
		// (0/3*3/5) / (0/3*3/5 + 0/2*2/5) = 0
		p = this.getProbability("good", "notInThere");
		logger.debug("nb-P('good'|'notInThere'): "+p);
		Assert.assertEquals(0., p);
		
		p = this.getProbability("notExisting", "quick");
		logger.debug("nb-P('notExisting'|'quick'): "+ p);
		Assert.assertEquals(0., p);
		
		p = this.getProbability("notExisting", "notInThere");
		logger.debug("nb-P('notExisting'|'notInThere'): "+ p);
		Assert.assertEquals(0., p);
			
		String[] notInThere = new String[] { "notInThere", "notInThereToo" };
		p = this.getProbability("notExisting", notInThere);
		logger.debug("nb-P('notExisting'|'notInThere','notInThereToo'): "+p);
		Assert.assertEquals(0., p);
		
		String[] words = new String[] { "quick", "rabbit" };
		p = this.getProbability("good", words);
		logger.debug("nb-P('good'|'quick','rabbit'): "+p);

//		11:16:50 DEBUG NaiveBayes.getCategoryProbability() -    P('good') = 3/5 = 0.6
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('quick'|'good') = 2/3 = 0.6666666666666666
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('rabbit'|'good') = 1/3 = 0.3333333333333333
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('quick','rabbit'|'good') = 0.2222222222222222
//		11:16:50 DEBUG NaiveBayes.getCategoryProbability() -    P('good') = 3/5 = 0.6
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('quick'|'good') = 2/3 = 0.6666666666666666
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('rabbit'|'good') = 1/3 = 0.3333333333333333
//		11:16:50 DEBUG NaiveBayes.getCategoryProbability() -    P('bad') = 2/5 = 0.4
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('quick'|'bad') = 1/2 = 0.5
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('rabbit'|'bad') = 0/2 = 0.0
//		11:16:50 DEBUG TestNaiveBayes.testProbability() - P('good'|'quick','rabbit') 1.0000000000000002
//		
		// Weka: 0.884; own result 1.0000000000000002
		double prob1 = this.getProbability("good", "quick rabbit".split("\\W"));
		logger.debug("P('good'|'quick','rabbit') "+prob1);
		Assert.assertEquals(p,prob1);
//		
//		11:16:50 DEBUG NaiveBayes.getCategoryProbability() -    P('bad') = 2/5 = 0.4
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('quick'|'bad') = 1/2 = 0.5
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('rabbit'|'bad') = 0/2 = 0.0
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('quick','rabbit'|'bad') = 0.0
//		11:16:50 DEBUG NaiveBayes.getCategoryProbability() -    P('good') = 3/5 = 0.6
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('quick'|'good') = 2/3 = 0.6666666666666666
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('rabbit'|'good') = 1/3 = 0.3333333333333333
//		11:16:50 DEBUG NaiveBayes.getCategoryProbability() -    P('bad') = 2/5 = 0.4
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('quick'|'bad') = 1/2 = 0.5
//		11:16:50 DEBUG NaiveBayes.getConditionalProbability() -    P('rabbit'|'bad') = 0/2 = 0.0
//		11:16:50 DEBUG TestNaiveBayes.testProbability() - P('bad'|'quick','rabbit'): 0.0
//		
		// Weka: 0.116, own result 0.0
		double prob2 = this.getProbability("bad", "quick rabbit".split("\\W"));
		logger.debug("P('bad'|'quick','rabbit'): "+prob2);
		
		assertEquals("Testing the sum of probability and complementary probability",new Double(1.), new Double(prob1+prob2), new Double(0.00000000003));
	}
	
	@Test
	public void testWeightedProbability()
	{
		// P(C|F) = P(F|C)*P(C)/P(F)
		//        = wP(F|C)*P(C)/(P(F|C1)*P(C1)+...+P(F|Cn)*P(Cn))
		//        = wP('notInThere'|'good')*P('good')/(wP('notInThere'|'good')*P('good')+wP('notInThere'|'bad')*P('bad'))
		// P('notInThere'|'good') = 0/3 = 0
		// P('notInThere'|'bad') = 0/2 = 0
		// P('good') = 3/5 = 0.6
		// P('bad') = 2/5 = 0.4
		// wP('notInThere'|'good') = ((1*0.5+0*(0/3)) / (0+1)) = 0.5
		// wP('notInThere'|'bad') =  ((1*0.5+0*(0/2)) / (0+1)) = 0.5
		//
		// (0.5*0.6) / (0.5*0.6 + 0.5*0.4) = 0.6 
		double p = this.getWeightedProbability("good", "notInThere");
		logger.debug("nb-wP('good'|'notInThere'): "+p);
		Assert.assertEquals(0.6, p);
		
		// (0.5*0.4) / (0.5*0.6 + =.5*0.4) = 0.4
		double p2 = this.getWeightedProbability("bad", "notInThere");
		logger.debug("nb-wP('notInThere'|'bad'): "+p2);
		Assert.assertEquals(0.4, p2);
		Assert.assertEquals(1., p+p2);
		
		// P(C|F1,F2) = P(F1,F2|C)*P(C)/P(F1,F2)
		//            = wP(F1|C)*wP(F2|C)*P(C) / [wP(F1|C1)*wP(F2|C1)*P(C1) +...+ wP(F1|Cn)*wP(F2|Cn)*P(Cn)]
		//            = wP('notInThere'|'good')*wP('notInThereToo'|'good')*P('good') / 
		//                  [wP('notInThere'|'good')*wP('notInThereToo')*P('good') +
		//                   wP('notInThere'|'bad')*wP('notInThereToo'|'bad')*P('bad')]
		// P('notInThere'|'good') = 0/3
		// P('notInThereToo'|'good') = 0/3
		// P('notInThere'|'bad') = 0/2 = 0.5
		// p('notInThereToo'|'bad') =  0/2 = 0.5
		// P('good') = 3/5 = 0.6
		// P('bad') = 2/5 = 0.4
		// wP('notInThere'|'good') = ((1*0.5+0*(0/3)) / (0+1)) = 0.5
		// wP('notInThere'|'bad') =  ((1*0.5+0*(0/2)) / (0+1)) = 0.5
		// wP('notInThereToo'|'good') = (1*0.5+0*(0/3)) / (0+1)) = 0.5
		// wP('notInThereToo'|'bad') =  (1*0.5+0*(0/2)) / (0+1)) = 0.5
		//
		// (0.5*0.5*0.6) / (0.5*0.5*0.6 + 0.5*0.5*0.4) = 0.6
		String[] notInThere = new String[] { "notInThere", "notInThereToo" };
		double p4 = this.getWeightedProbability("good", notInThere);
		logger.debug("nb-wP('good'|'notInThere','notInThereToo'): "+p4);
		Assert.assertEquals(p, p4);
		
		// (0.5*0.5*0.4) / (0.5*0.5*0.6 + 0.5*0.5*0.4) = 0.4
		double p5 = this.getWeightedProbability("bad", notInThere);
		logger.debug("nb-wP('bad'|'notInThere','notInThereToo'): "+p5);
		Assert.assertEquals(p2, p5);
		Assert.assertEquals(1.,(p4+p5));
	}
	
	@Test
	public void testClassification()
	{
		String category = this.classify("quick rabbit".split("\\W"));
		logger.debug("classify 'quick rabbit' as: "+category);
		Assert.assertEquals("good", category);
		
		category = this.classify("quick money".split("\\W"));
		logger.debug("classify 'quick money' as: "+category);
		Assert.assertEquals("bad", category);
		
		logger.debug("Setting Threshold to 3.0");
		this.setThreshold("bad", 3.0f);
		
		category = this.classify("quick money".split("\\W"));
		logger.debug("classify 'quick money' as: "+category);
		Assert.assertNull(category);
		
		logger.debug("Train sample data 10 times");
		for (int i=0; i<10; i++)
			this.sampleTrain();
		
		category = this.classify("quick money".split("\\W"));
		logger.debug("classify 'quick money' as: "+category);
		Assert.assertEquals("bad", category);
	}
}
