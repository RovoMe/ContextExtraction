package at.rovo.textextraction.templateIndependent;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import at.rovo.UrlReader;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;

public class TemplateIndependentNewsExtractor
{
	private String docUrl = null;
	private float lambda = 0.03f;
	private int thetaGap = 4;
	private int WC = 10;
	/** The stopword list **/
	private List<String> SW = new ArrayList<String>();

	public TemplateIndependentNewsExtractor()
	{
		try
		{
			this.loadStopList();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
	}
	
	public TemplateIndependentNewsExtractor(String url)
	{
		this();
		this.docUrl = url;
	}
	
	private void loadStopList() throws IOException
	{
		// stopwords taken from http://www.ranks.nl/resources/stopwords.html
		// and http://norm.al/2009/04/14/list-of-english-stop-words/
		BufferedReader br = new BufferedReader(new FileReader("stopwords.txt"));
	    try 
	    {
	        String line = br.readLine();
	        while (line != null) 
	        {
	            this.SW.add(line.trim());
	            line = br.readLine();
	        }
	    } 
	    finally 
	    {
	        br.close();
	    }		
	}

	public String predictText(String url)
	{
		String html;
		if (url.startsWith("http://"))
		{
			this.docUrl = url;
			
			UrlReader reader = new UrlReader();
			html = reader.readPage(url);
		}
		else
			html = url;
		
		ParseResult result = Parser.tokenize(html, false);
		List<Token> tokens = result.getParsedTokens();
		
		// At the beginning, we define a segment s consists of  sequence of
		// consecutive tokens (might list in multiple lines).
		List<String> sequences = this.generateSequenceList(tokens);
		
		// Candidate Detection Method to list a set of content areas.
		int gap = 0;
		List<String> candidates = new ArrayList<String>();
		StringBuilder builder = new StringBuilder();
		for (String s : sequences)
		{
			if (s.equals(""))
				continue;
			
			// The algorithm scans the following parts of the document until the
			// number of gap exceeds thetaGap.
			// A gap is a line that has less number of words compared with WC
			if (s.replaceAll("(?s)<a[^>]*?>(.*?)</a>", "$1").split(" ").length > this.WC)
			{
				if (builder == null)
					builder = new StringBuilder();
				builder.append(s+"\n");
				gap = 0;
			}
			else
				gap++;
			
			if (gap > this.thetaGap)
			{
				if (builder != null)
					candidates.add(builder.toString());
				builder = null;
			}
		}
		
		// Initially, the algorithm scans the whole document and roughly 
		// localizes a candidate set by estimating the maximum score for each
		// sequence. The scoring function is to estimate the possibility of s to 
		// be the content area
		double maxScore = 0.;
		String maxS = null;
		List<Double> scores = new ArrayList<Double>();
		for (String s : candidates)
		{				
			// The algorithm design a stopword language model to select the k 
			// candidates with highest generative probability.
			// It also considers the negative effect of the unimportant links 
			// through calculating the penalty score of the hyperlinks.
			double score = this.SScore(s);
			if (score > maxScore)
			{
				maxScore = score;
				maxS = s;
			}
			
			scores.add(score);
		}
		System.out.println("maxScore: "+maxScore+" - "+maxS+"\n");
		
		// In the final step, the algorithm finds the news content area by 
		// combining both scores from stopword language model and link penalty.		
		int pos = 0;
		double theta = 0.2;
		for (String candidate : candidates)
		{			
			if (( maxScore - theta) - scores.get(pos) > 0)
			{			
				String s = candidate.replaceAll("(?s)<a[^>]*?>(.*?)</a>", "$1");
				System.out.println("S: "+scores.get(pos)+"\n"+s);
			}
			pos++;
		}
		
		return "";
	}
	
	/**
	 * <p>Generates a list of word-sequences from HTML and word-tokens by 
	 * filtering out all tokens that are not words.</p>
	 * 
	 * @param tokens The tokens as provided by the Parser after tokenizing 
	 *               a HTML page
	 * @return A list of extracted word-sequences.
	 */
	private List<String> generateSequenceList(List<Token> tokens)
	{
		List<String> sequences = new ArrayList<String>();
		StringBuilder builder = new StringBuilder();
		for (Token token : tokens)
		{
			if (token instanceof Word)
			{
				if (builder == null)
					builder = new StringBuilder();
				builder.append(token.getText());
				builder.append(" ");
			}
			else
			{				
				Tag tag = (Tag) token;
				if (tag.getShortTag().equals("a"))
				{
					String urlRef = null;
					if (tag.isOpeningTag() && tag.getText().contains("href="))
					{
						String _tag = tag.getText();
						for (String seg : _tag.split(" "))
						{
							if (seg.contains("href"))
							{
								urlRef = seg.replaceAll(">", "");
								break;
							}
						}
						
						if (builder == null)
							builder = new StringBuilder();

						builder.append("<a "+urlRef+">");
							
					}
					else if (!tag.isOpeningTag() && builder != null)
					{
						builder.append("</a>");
					}
				}
//				else if (tag.getShortTag().equals("p"))
//				{
//					if (builder == null)
//						builder = new StringBuilder();
//					if (!tag.isOpeningTag())
//						builder.append("\n");
//				}
				else if (tag.getShortTag().equals("span"))
				{
					if (builder == null)
						builder = new StringBuilder();
				}
				else if (tag.getShortTag().equals("em"))
				{
					if (builder == null)
						builder = new StringBuilder();
				}
				else
				{
					if (builder != null)
						sequences.add(builder.toString());
					builder = null;
				}
			}
		}
		return sequences;
	}
	
	private double SScore(String s)
	{
		// SScore(s) = WS(s) - lambda * LS(s)
		// WS(s) estimates the content score of the word sequence given the segment s
		// LS(s) is the function of link penalty score for s
		double ws = this.WS(s);
		double ls = this.LS(s);
		return ws - this.lambda * ls;
	}
	
	/**
	 * <p>Estimates the content score of the word sequence given the segment s.
	 * </p>
	 * <p>A segment that contains rich stopwords is highly possible to be the 
	 * content text. A probability framework based on stopword language model is 
	 * used to detect such candidates.</p>
	 * 
	 * @param s The segment <em>s</em> containing the words to estimate the 
	 *          score for
	 * @return The content score of the segment
	 */
	private double WS(String s)
	{
		// The stopword language model measures the likelihood of all stopwords
		// in the given segment s. The likelihood is applied by Bayes' rule
		// P(s|SW) = P(s,SW)/P(SW) = P(SW|s)P(s)/P(SW) with P(s) being the 
		// language model of candiate s and P(SW) the stopword language model of
		// the stopword sequence - but both can be ignored as both do not affect
		// the finding of text area!
		// P(SW|s) is the most important factor for the above equation. It 
		// measures the probability of generating SW (stopword) given the 
		// candidate s.
		s = s.replace("&rsquo;", "'");
		s = s.replaceAll("<(\\w*)[^>]*>([^<]*?)</\\1>", "$2");
		s = s.replaceAll("[,|.|:|;|!|?]", "");
		s = s.toLowerCase();
		
		Hashtable<String, Integer> table = new Hashtable<String, Integer>();
		double denum = 0.;
		for (String w : this.SW)
//		for (String w : s.split(" "))
			denum += this.getWordFrequency(w, s, table);
		
		if (denum == 0.)
			return 0.;
		
		double p = 1.;
		for (String w : this.SW)
//		for (String w : s.split(" "))
			for (String seq : s.split(" "))
			{
				if (seq.trim().equals(w))
				{
					int wordFrequency = table.get(w);
					p *= wordFrequency / denum;
				}
			}
		
		return p;
	}
	
	/**
	 * <p>Calculates the frequency of the word <em>w</em> of being in the 
	 * sequence <em>s</em>.</p>
	 * 
	 * @param w The word whose frequency should be calculated for
	 * @param s The sequence containing all words
	 * @return The frequency of the word inside the sequence
	 */
	private int getWordFrequency(String w, String s, Hashtable<String, Integer> table)
	{
		if (s.trim().equals(w))
		{
			table.put(w, 1);
			return 1;
		}

		int totalNum = s.split(" ").length;
		int numAfterRemoval = s.replaceAll("\\b"+w+"(?<!.>|<.|</.)\\b[^<]?", "").split(" ").length;
		int wordFreq = totalNum - numAfterRemoval;
		
		if (table != null)
			table.put(w, wordFreq);
		
		return wordFreq;
	}
	
	/**
	 * <p>Estimates a link panelization score for the given segment s.</p>
	 * 
	 * @param s The segment <em>s</em> containing words and links
	 * @return The link panelization score for the given segment
	 */
	private double LS(String s)
	{
		// LS(s) = LW(s)+SWL(s)+UC(s.url, Doc.url)
		// LW(s) is the linked word string size (the number of words between 
		//       <a href="...">...</a>)
		// SWL(s) measures the number of links that contain at least one stopword
		// UC(s.url, Doc.url) compares the url string between the given html 
		//                    document (Doc) and s
		double res = this.LW(s) + this.SWL(s) + this.UC(s, this.docUrl);
		
		return res;
	}
	
	/**
	 * <p>Counts the words inside link-tag-pairs (&lt;a href="..">...&lt;/a>).</p>
	 * 
	 * @param s The segment containing text and links
	 * @return The number of words inside a link-tag-pair 
	 */
	private int LW(String s)
	{
		// remove all attributes specified in the link to not end up with a wrong
		// number of words
		String sModified = s.replaceAll("(?s)<a[^>]*?>(.*?)</a>","<a>$1</a>");
		sModified = sModified.replaceAll("\\W*<([^>]*?)>\\W*", " <$1> ");
		int numTokens = sModified.split(" ").length;
		int res = numTokens - sModified.replaceAll("(?s)<a>.*?</a>", "<a> </a>").split(" ").length;

		return res;
	}
	
	/**
	 * <p>Measures the number of links that contain at least one stopword.</p>
	 * 
	 * @param s The segment containing text and links
	 * @return The proportion of links that contain at least one stopword
	 */
	private double SWL(String s)
	{
		Pattern p = Pattern.compile("(?s)<a[^>]*?>(.*?)</a>");
		Matcher m = p.matcher(s);
		int totalLinks = 0;
		int linksWithStopword = 0;
		while (m.find())
		{
			totalLinks++;
			String urlText = m.group(1);
			for (String stopword : this.SW)
			{
				for (String text : urlText.split(" "))
				{
					if (text.equals(stopword))
					{
						linksWithStopword++;
						break;
					}
				}
			}
		}
		if (totalLinks == 0)
			return 0.;
//		double res = ((double)linksWithStopword) / totalLinks;
		return linksWithStopword;
	}
	
	/**
	 * <p>Compares the URL string between the given HTML document (docUrl) and 
	 * the URL found in the segment s (sURL).</p>
	 * <p>It therefore needs to find the average string similarity among all
	 * its sub-links.</p>
	 * 
	 * @param sUrl The URL found in the segment s
	 * @param docUrl The URL of the given HTML document
	 * @return
	 */
	private double UC(String sUrl, String docUrl)
	{
		// UC(s.url, Doc.url) = avg PSim(li.url, Doc.url)
		// where li is an element of s
		// To reduce the effect of extreme-values, we average UC by estimating 
		// averaged URL string similarity score between given HTML document and
		// all its sublink li in candidate s.
		Pattern pattern = Pattern.compile("<a href=\"(.*?)\">");
		Matcher matcher = pattern.matcher(sUrl);
		List<String> urls = new ArrayList<String>();
		while (matcher.find())
		{
			urls.add(matcher.group(1));
		}
		if (urls.isEmpty())
			return 0.;
		
		double val = 0.;
		for (String url : urls)
		{
			val += PSim(url, docUrl);
		}
		double res = val / urls.size();
		
		return res;
	}
	
	/**
	 * <p>Calculates the string similarity based on prefix weighting.</p>
	 * 
	 * @param xUrl
	 * @param yUrl
	 * @return
	 */
	private double PSim(String xUrl, String yUrl)
	{
		double part1 = 0;
		double part2 = 0;
		for (int i=0, j=0; i<xUrl.length() && j<yUrl.length(); i++, j++)
		{
			int diff = Math.abs(xUrl.charAt(i) - yUrl.charAt(j));
			part1 += (diff / (i+1.));
			part2 += (diff / (j+1.));
		}
		return part1 / xUrl.length() + part2 / yUrl.length() ;
	}
	
	public static void main(String[] args)
	{
//		String url = "http://www.washingtonpost.com/business/economy/romney-chose-paul-ryan-to-shift-the-campaign-debate-will-the-gamble-pay-off/2012/08/13/f9ae54e2-e557-11e1-9739-eef99c5fb285_story.html";
//		TemplateIndependentNewsExtractor extractor = new TemplateIndependentNewsExtractor(url);
//		String sample = "It doesn&rsquo;t take a political genius to see where the contest between <a href=\"http://www.washingtonpost.com/barack-obamas-2012-reelection-campaign/gIQAVODn7O_topic.html?tid=rr_mod_candidate\">President Obama</a> and <a href=\"www.washingtonpost.com/mitt-romney-2012-presidential-candidate/gIQANxIecO_topic.html\">Mitt Romney</a> is heading. With Rep. <a href=\"www.washingtonpost.com/politics/paul-ryan-r-wis/gIQAUWiV9O_topic.html\">Paul Ryan</a> on the Republican ticket, the campaign is looking at a full throated debate over the future of Medicare. Are Romney and Ryan ready?";
//		String sample2 = "Mitt Romney chose Paul Ryan to shift the campaign debate; will the gamble pay off. <a href=\"http://www.washingtonpost.com/barack-obamas-2012-reelection-campaign/gIQAVODn7O_topic.html?tid=rr_mod_candidate\">LW count test which now includes a stopword</a> and more items.";
//		String sample3 = "But from the moment Ryan introduced his blueprint, called <a href=\"http://budget.house.gov/fy2013prosperity/\">the Path to Prosperity</a>, Democrats have considered his plan to fundamentally alter Medicare to be the most politically vulnerable of his budget recommendations. That’s one big reason Democrats were gleeful when the news broke late Friday night that Romney had selected the Wisconsin congressman as his vice presidential running mate.";
//		String sample4 = "a the";
		
//		System.out.println(extractor.WS(sample4));
		
//		System.out.println(extractor.WS(sample));
//		System.out.println(extractor.LS(sample));
//		System.out.println(extractor.LW(sample));
//		System.out.println(extractor.SWL(sample));
//		System.out.println(extractor.UC(sample, url));
//		System.out.println(extractor.PSim("http://www.washingtonpost.com/business/", url));
		
		
//		System.out.println(extractor.SScore("Republicans familiar with the deliberations that led to the pick say Romney and his advisers went into this marriage with eyes open about the pluses and minuses of putting the House Budget Committee chairman on the ticket."));
		new TemplateIndependentNewsExtractor().predictText("http://www.washingtonpost.com/business/economy/romney-chose-paul-ryan-to-shift-the-campaign-debate-will-the-gamble-pay-off/2012/08/13/f9ae54e2-e557-11e1-9739-eef99c5fb285_story.html");
	}
}
