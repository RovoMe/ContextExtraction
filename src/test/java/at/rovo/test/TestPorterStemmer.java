package at.rovo.test;

import static org.junit.Assert.assertEquals;
import org.junit.Test;
import at.rovo.stemmer.PorterStemmer;

public class TestPorterStemmer 
{
	@Test
	public void test() 
	{
		assertEquals("relat", PorterStemmer.stem("Relate"));
		assertEquals("probat", PorterStemmer.stem("PROBATE"));
		assertEquals("conflat", PorterStemmer.stem("Conflate"));
		assertEquals("pirat", PorterStemmer.stem("Pirate"));
		assertEquals("prelat", PorterStemmer.stem("prelate"));

		assertEquals("deriv", PorterStemmer.stem("derivate"));
		assertEquals("activ", PorterStemmer.stem("activate"));
		assertEquals("demonstr", PorterStemmer.stem("demonstrate"));
		assertEquals("necessit", PorterStemmer.stem("necessitate"));
		assertEquals("renov", PorterStemmer.stem("renovate"));
		
		assertEquals("adop", PorterStemmer.stem("adoption"));
		assertEquals("gener", PorterStemmer.stem("GENERALIZATIONS"));
		assertEquals("oscil", PorterStemmer.stem("OSCILLATORS"));
		assertEquals("sky", PorterStemmer.stem("sky"));
		
		assertEquals("control", PorterStemmer.stem("controll"));
		assertEquals("roll", PorterStemmer.stem("roll"));
		assertEquals("reviv", PorterStemmer.stem("revival"));
		assertEquals("good", PorterStemmer.stem("goodness"));
		assertEquals("formal", PorterStemmer.stem("formalize"));
		assertEquals("form", PorterStemmer.stem("formative"));
		assertEquals("sensibl", PorterStemmer.stem("sensibility"));
	}

}
