package at.rovo.test;

import static org.junit.Assert.*;
import java.util.ArrayList;
import java.util.List;
import junit.framework.Assert;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Test;

import at.rovo.parser.Parser;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.textextraction.ExtractionException;
import at.rovo.textextraction.mss.MaximumSubsequenceSegmentation;

public class TestMaximumSubsequenceSegmentation extends	MaximumSubsequenceSegmentation 
{
	private static Logger logger = LogManager.getLogger(TestMaximumSubsequenceSegmentation.class.getName());
	
	@Test
	public void kMaximumSubsequences() 
	{
		// example as presented in the paper: 
		// 'A linear time algorithm for finding all maximal scoring subsequences'
		List<Double> data = new ArrayList<Double>();
		data.add(4.);
		data.add(-5.);
		data.add(3.);
		data.add(-3.);
		data.add(1.);
		data.add(2.);
		data.add(-2.);
		data.add(2.);

		List<List<Double>> I = new ArrayList<List<Double>>();
		List<Double> L = new ArrayList<Double>();
		List<Double> R = new ArrayList<Double>();
		List<Integer> startPos = new ArrayList<Integer>();
		double kumulScore = this.kMaximumSubsequences(data, I, L, R, startPos);
		logger.debug("original sequence: "+data);
		logger.debug("subsequences: "+I);
		logger.debug("starting positions: "+startPos);
		// Setup of expected data
		List<List<Double>> i = new ArrayList<List<Double>>();
		List<Double> i1 = new ArrayList<Double>(); i1.add(4.);
		List<Double> i2 = new ArrayList<Double>(); i2.add(3.);
		List<Double> i3 = new ArrayList<Double>(); i3.add(1.); i3.add(2.);
		List<Double> i4 = new ArrayList<Double>(); i4.add(2.);
		i.add(i1); i.add(i2); i.add(i3); i.add(i4);
		List<Double> l = new ArrayList<Double>();
		l.add(0.); l.add(-1.); l.add(-1.); l.add(0.);
		List<Double> r = new ArrayList<Double>();
		r.add(4.); r.add(2.); r.add(2.); r.add(2.);
		// test
		Assert.assertEquals(2., kumulScore);
		Assert.assertEquals(i, I);
		Assert.assertEquals(l, L);
		Assert.assertEquals(r, R);
		
		// first addition
		data.add(-2.);
		kumulScore = this.kMaximumSubsequences(data, I, L, R, startPos);
		logger.debug("original sequence: "+data);
		logger.debug("subsequences: "+I);
		logger.debug("starting positions: "+startPos);
		Assert.assertEquals(0., kumulScore);
		Assert.assertEquals(i, I);
		Assert.assertEquals(l, L);
		Assert.assertEquals(r, R);
		
		// next run
		data.add(1.);
		kumulScore = this.kMaximumSubsequences(data, I, L, R, startPos);
		logger.debug("original sequence: "+data);
		logger.debug("subsequences: "+I);
		logger.debug("starting positions: "+startPos);
		// add expected data
		List<Double> i5 = new ArrayList<Double>(); i5.add(1.);
		i.add(i5);
		l.add(0.);
		r.add(1.);
		// test
		Assert.assertEquals(1., kumulScore);
		Assert.assertEquals(i, I); 
		Assert.assertEquals(l, L);
		Assert.assertEquals(r, R);
		
		// next run
		data.add(5.);
		kumulScore = this.kMaximumSubsequences(data, I, L, R, startPos);
		logger.debug("original sequence: "+data);
		logger.debug("subsequences: "+I);
		logger.debug("starting positions: "+startPos);
		// add expected data
		i.remove(4); i.remove(3);
		i3.add(-2.); i3.add(2.); i3.add(-2.); i3.add(1.); i3.add(5.);
		l.remove(4); l.remove(3);
		r.set(2, r.get(r.size()-1)+5.);
		r.remove(4); r.remove(3);
		// test
		Assert.assertEquals(6., kumulScore);
		Assert.assertEquals(i, I); 
		Assert.assertEquals(l, L);
		Assert.assertEquals(r, R);
	}
	
//	@Test
	public void testTextCleaning()
	{
		// part extracted from http://edition.cnn.com/2012/08/13/world/europe/norway-massacre-report/index.html?hpt=hp_t3
		String test = "<a name=\"em1\"></a>" +
		 "<div class=\"cnn_strylftcntnt cnn_strylftcexpbx\" id=\"expand18\">" +
		 "  <div style=\"display: none;\" class=\"cnn_strylceclbtn\">" +
		 "    <img src=\"http://i.cdn.turner.com/cnn/.e/img/3.0/mosaic/bttn_close.gif\" alt=\"\" border=\"0\" height=\"23\" width=\"58\">" +
		 "  </div>" +
		 "  <div style=\"display: none;\" id=\"videoContainerexpand18\" class=\"parentMediaContainer\">" +
		 "    <div id=\"videoContainerexpand18Media\" class=\"mediaContainer\">" +
		 "      <div class=\"cnnvideo_wrapper\" id=\"videoContainerexpand18Media-videowrapper\">" +
		 "        <img src=\"http://i2.cdn.turner.com/cnn/dam/assets/120425061409-nc-pracon-norway-survivor-00031603-story-body.jpg\" alt=\"Watch this video\" height=\"360\" width=\"640\">" +
		 "        <a class=\"cnnvideo_clicklink\" href=\"#\" title=\"Click to watch this video\">" +
		 "          <div class=\"cnnvideo_playcontainer cnnvideo_click_standard\" style=\"top:138px;left:220px;\">" +
		 "          </div>" +
		 "        </a>" +
		 "      </div>" +
		 "    </div>" +
		 "  </div>" +
		 "  <div style=\"cursor: pointer;\" id=\"clickToPlayvideoContainerexpand18\" class=\"clickToPlay\">" +
		 "  </div>" +
		 "  <img style=\"cursor: pointer;\" src=\"http://i2.cdn.turner.com/cnn/dam/assets/120425061409-nc-pracon-norway-survivor-00031603-story-body.jpg\" alt=\"\" class=\"box-image\" border=\"0\" height=\"120\" width=\"214\">" +
		 "  <cite class=\"expCaption\">" +
		 "    <span>Norway massacre survivor talks </span>" +
		 "  </cite>" +
		 "</div>" +
		 "<p class=\"cnn_storypgraphtxt cnn_storypgraph8\">Authorities say he roamed the island shooting at campers, killing 69 people before members of an elite Norwegian police unit took him into custody.</p>";
		List<Token> tokens = Parser.tokenize(test, false).getParsedTokens();
		List<Token> actual = this.cleanText(tokens);
		StringBuilder builder = new StringBuilder();
		boolean blank = false;
		for (Token token : actual)
		{
			if (blank && token instanceof Word)
				builder.append(" ");
			builder.append(token.getText());
			if (token instanceof Word)
				blank = true;
			else
				blank = false;
			
		}
//		Assert.assertEquals("<p class=\"cnn_storypgraphtxt cnn_storypgraph8\">Authorities say he roamed the island shooting at campers, killing 69 people before members of an elite Norwegian police unit took him into custody.</p>", builder.toString());
		Assert.assertEquals("<cite class=\"expCaption\">Norway massacre survivor talks</cite><p class=\"cnn_storypgraphtxt cnn_storypgraph8\">Authorities say he roamed the island shooting at campers, killing 69 people before members of an elite Norwegian police unit took him into custody.</p>", builder.toString());
	}

	@Override
	public String predictText(String url) throws ExtractionException 
	{
		fail("Not yet implemented");
		return null;
	}

	@Override
	public List<String> predictText(List<String> urls) throws ExtractionException 
	{
		fail("Not yet implemented");
		return null;
	}
}
