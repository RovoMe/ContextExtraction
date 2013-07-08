package at.rovo.test;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import at.rovo.common.UrlReader;
import at.rovo.parser.ParseResult;
import at.rovo.parser.Parser;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.diff.LinearDiff;
import at.rovo.diff.Results;
import at.rovo.diff.Snake;
import at.rovo.textextraction.mss.NoSubsequenceFoundException;
import at.rovo.textextraction.mss.SimpleMSS;

public class TemplateBasedExtraction 
{
	public static void main(String[] args) throws IOException
	{		
		String[] inFile = new String[] 
		{ 
//				"http://www.washingtonpost.com/business/economy/romney-chose-paul-ryan-to-shift-the-campaign-debate-will-the-gamble-pay-off/2012/08/13/f9ae54e2-e557-11e1-9739-eef99c5fb285_story.html",
//				"http://www.washingtonpost.com/business/economy/obamas-record-on-outsourcing-draws-criticism-from-the-left/2012/07/09/gJQAljJCZW_story.html",
				"http://www.washingtonpost.com/business/technology/larry-page-speaks-at-googles-annual-conference-in-san-francisco/2013/05/15/ac591e22-bda4-11e2-9b09-1638acc3942e_story.html",
				"http://www.washingtonpost.com/business/technology/google-to-make-deep-cuts-at-motorola/2012/08/13/501f20b2-e53b-11e1-8f62-58260e3940a0_story.html?hpid=z3",
//				"http://www.washingtonpost.com/business/technology/google-fights-piracy-with-search/2012/08/10/f8d1be0e-e31f-11e1-a25e-15067bb31849_story.html",
//				"http://www.independent.co.uk/news/uk/politics/socialhousing-landlords-training-staff-to-spot-tenants-at-risk-of-suicide-8621669.html", 
//				"http://www.independent.co.uk/news/uk/politics/revealed-devastating-impact-of-bedroom-tax-sees-huge-leap-in-demand-for-emergency-hardship-handouts-for-tenants-8621666.html", 
//				"http://www.independent.co.uk/news/world/europe/revealed-eerie-new-images-show-forgotten-french-apartment-that-was-abandoned-at-the-outbreak-of-world-war-ii-and-left-untouched-for-70-years-8613867.html" 
		};
		
		List<List<Token>> p = new ArrayList<List<Token>>();
		List<List<Token>> htmlTokens = new ArrayList<List<Token>>();
		List<Token> selTokens = null;
		boolean first = true;
		String[] word = new String[] { "w", "t"};
		
		for (int i = 0; i<inFile.length; i++)
		{
			String html = readFile(inFile[i]);
			Parser parser = new Parser();
			ParseResult parse = parser.tokenize(html, false);
			List<Token> tokens = parse.getParsedTokens();
			htmlTokens.add(tokens);
			
			p.add(normalize(tokens,word[i]));
		}
		
		if (first)
			selTokens = htmlTokens.get(0);
		else
			selTokens = htmlTokens.get(1);
		
		Token[] t = new Token[0];
		SimpleMSS mss = new SimpleMSS();
		for (int i=1; i<inFile.length; i++)
		{
			try
			{
				List<Integer> dist = new ArrayList<Integer>();
				dist.add(0);
				Results<Token> res = LinearDiff.Compare(p.get(0).toArray(t), p.get(i).toArray(t));
//				Results<Token> res = GreedyDiff.Compare(p.get(0).toArray(t), p.get(i).toArray(t), false);
				if (res != null)
				{
					buildScoreModifier(res, dist, first);
				}
				dist.remove(dist.size()-1);
				
				try 
				{
					StringBuilder sb = new StringBuilder();
//					for (Token tok : selTokens)
//					{
//						sb.append(tok.getText()+"\n");
//					}
//					writeFile("html.txt", sb.toString());
//					sb = new StringBuilder();
					for (Token tok : p.get(0))
					{
						sb.append(tok.getText()+"\n");
					}
					writeFile("p0.txt", sb.toString());
					sb = new StringBuilder();
					for (Token tok : p.get(1))
					{
						sb.append(tok.getText()+"\n");
					}
					writeFile("p1.txt", sb.toString());
					
					int d = 0;
					// Build a score-list for the Maximum Subsequence algorithm to work with
					// Like in the paper, Jeff Pasternack and Dan Roth suggested, the simple
					// method assigns a score of -3.25 to every tag and +1 to every word
					List<Double> score = new ArrayList<Double>();
					for (Token token : selTokens)
					{
						if (token instanceof Tag)
						{
							// 2.4
//							Tag tag = (Tag)token;
//							String st = tag.getShortTag();
//							if (st.equals("p"))
//								score.add(0.25*dist.get(d++));
//							else if (st.equals("a"))
//								score.add(-2.);
//							else if (st.equals("script"))
//								score.add(-9.);
//							else
								score.add(-3.25+0.25*dist.get(d++));
						}
						else if (token instanceof Word) // 1.5
							score.add(1d+1.0*dist.get(d++));
//							score.add(1.);
					}					
			
					// run the Maximum Subsequence Optimization
					List<Double> maxSS = new ArrayList<Double>();
					int start = mss.topMaximumSubsequence(score, maxSS);
//					System.out.println("maxSS: "+maxSS);
//					System.out.println("start: "+start);
//					System.out.println("html.size: "+selTokens);
					
					if (maxSS == null || maxSS.size() < 1)
						throw new NoSubsequenceFoundException("No maximum sequence found!");
					
					// build the list of the predicted article list
					List<Token> text = new ArrayList<Token>();
					for (int j=start; j<=start+maxSS.size(); j++)
						text.add(selTokens.get(j));
					System.out.println("predictedText: "+text);

					String output = formatText(mss.cleanText(text));
					output = output.replaceAll("[\r|\t\n]+", "\n");
					System.out.println(output);
				} 
				catch (NoSubsequenceFoundException e) 
				{
					e.printStackTrace();
				}
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}
	
	private static String readFile(String file) throws IOException
	{
		System.out.println("Reading file '"+file+"'");
		if (file.startsWith("http://"))
			return new UrlReader().readPage(file);
		String result = null;
		BufferedReader br = new BufferedReader(new FileReader(file));
	    try 
	    {
	        StringBuilder sb = new StringBuilder();
	        String line = br.readLine();

	        while (line != null) 
	        {
	            sb.append(line);
//	            sb.append("\n");
	            line = br.readLine();
	        }
	        result = sb.toString();
	    } 
	    finally 
	    {
	        br.close();
	    }
	    
	    return result;
	}
	
	private static void writeFile(String file, String content) throws IOException
	{
		System.out.print("Writing file '"+file+"'");
	    PrintWriter out = new PrintWriter(new FileWriter(file));
	         
	    // Write text to file
	    out.println(content);
	    out.close();
	    System.out.println(" ... DONE");
	}
	
	private static void buildScoreModifier(Results<Token> res, List<Integer> dist, boolean first)
	{
		List<Snake<Token>> snakes = res.getSnakes();
		if (snakes != null)
		{
			int delVal = 0;
			for (Snake<Token> snake : snakes)
			{
				if (snake.DiagonalLength>0)
				{
					for (int j=0; j<snake.DiagonalLength; j++)
					{
						dist.add(0);
					}
					delVal = 0;
				}
				
				if (first)
				{
					if (snake.ADeleted > 0)
					{
						int tmp = dist.get(dist.size()-1);
						tmp = delVal+snake.ADeleted;
						dist.add(tmp);
					}
					else if (snake.BInserted > 0)
					{
						delVal += snake.BInserted;
					}
				}
				else
				{
					if (snake.BInserted > 0)
					{
						int tmp = dist.get(dist.size()-1);
						tmp = delVal+snake.BInserted;
						dist.add(tmp);
					}
					else if (snake.ADeleted > 0)
					{
						delVal += snake.ADeleted;
					}
				}
			}
		}
	}
	
	private static List<Token> normalize(List<Token> tokens, String word)
	{
		List<Token> normalized = new ArrayList<Token>();
		for (Token token : tokens)
		{
			if (token instanceof Word)
				normalized.add(new Word(word));
			else if (token instanceof Tag)
			{
				Tag tag = (Tag)token;
				normalized.add(new Tag("<"+(!tag.isOpeningTag() && !tag.isInlineCloseingTag() ? "/" : "")+tag.getShortTag()+(tag.isInlineCloseingTag() ? " /" : "")+">"));
			}
		}
		return normalized;
	}
		
	private static String formatText(List<Token> text)
	{
		StringBuilder builder = new StringBuilder();
		builder.append("\n");
		boolean blank = false;
		boolean append = true;
		boolean newLine = true;
		Token lastToken = null;
		for (Token t : text)
		{
			// if the last token was a word and this token is a word add a blank before the new token: 'word1 word2'
			if (blank && append && lastToken instanceof Word && lastToken.getText().trim().equals(",") && newLine == false)
				builder.append(" ");
			else if (blank && append && t instanceof Word && !t.getText().trim().equals(",") && newLine == false)
				builder.append(" ");
			// if the last token was a tag and it was a closing tag and the new token is a word add a blank: '</a> text'
			// only if the new word is neither a . or :
			if ((blank && append && lastToken instanceof Tag && !((Tag)lastToken).isOpeningTag()) && t instanceof Word && 
					!t.getText().equals(":") && !t.getText().equals(".") && newLine == false)
				builder.append(" ");
			// create a blank before a link if the last token was a word: 'word <a href...>'
			if (append && t instanceof Tag && lastToken instanceof Word && ((Tag)t).isOpeningTag() && 
					((Tag)t).getShortTag().equals("a") && newLine == false)
				builder.append(" ");
			
			if (t instanceof Tag)
			{
				blank = false;
				Tag tag = (Tag)t;
				// if the text contains <article>...</article> segments only use the part between those tags as content
				if (tag.getShortTag().equals("article") || tag.getShortTag().equals("more"))
				{ 
					if(tag.isOpeningTag())
						append = true;
					else 
						append = false;
				}
				// don't show special HTML tags
				if (append && !tag.getShortTag().equals("p") && !tag.getShortTag().equals("cite") && !tag.getShortTag().equals("li") && 
						!tag.getShortTag().equals("strong") && !tag.getShortTag().equals("i") && !tag.getShortTag().equals("b") &&
						!tag.getShortTag().equals("ul") && !tag.getShortTag().equals("span") && !tag.getShortTag().matches("h[1-6]") &&
						!tag.getShortTag().equals("article") && !tag.getShortTag().equals("abbr") && !tag.getShortTag().equals("em"))
				{
					builder.append(t.getText());
					newLine = false;
				}
				// insert a new line segment for certain HTML tags
				if (!tag.isOpeningTag() && append && (tag.getShortTag().equals("p") ||tag.getShortTag().matches("h1")))
				{
					builder.append("\n\n");
					newLine = true;
				}
				if (!tag.isOpeningTag() && (tag.getShortTag().matches("h[2-6]") || tag.getShortTag().equals("li") || tag.getShortTag().equals("cite")))
				{
					builder.append("\n");
					newLine = true;
				}
				// insert a blank after a span-tag
				if (!tag.isOpeningTag() && append && tag.getShortTag().equals("span") && builder.capacity()>0 && newLine==false)
					builder.append(" ");
			}
			else
			{
				if (append)
				{
					if (!t.getText().trim().equals(""))
					{
						builder.append(t.getText().trim());
						if (t.getText().endsWith(":"))
							builder.append(" ");
						newLine = false;
						blank = true;
					}
				}
			}
			lastToken = t;
		}
		
		// TODO: Replace with existing conversion method/library
		// replace special character encodings
		String txt = builder.toString();
		txt = txt.replaceAll("’", "'");
		txt = txt.replaceAll("–", "-");
		txt = txt.replaceAll("—", "-");
		txt = txt.replaceAll("‘", "'");
		txt = txt.replaceAll("’", "'");
		txt = txt.replaceAll(" ", " ");
		txt = txt.replaceAll("“", "\"");
		txt = txt.replaceAll("”", "\"");
		txt = txt.replaceAll("£", "L");
		
		txt = txt.replaceAll("â€“", "-");
		txt = txt.replaceAll("â€œ", "\"");
		txt = txt.replaceAll("â€", "\"");
			
		txt = txt.replaceAll("&quot;", "\"");
		txt = txt.replaceAll("&amp;", "&");
		txt = txt.replaceAll("&nbsp;", " ");
		txt = txt.replaceAll("&rsquo;", "'");
		txt = txt.replaceAll("&mdash;", "-");
		txt = txt.replaceAll("&ldquo;", "\"");
		txt = txt.replaceAll("&rdquo;", "\"");
		
		txt = txt.replaceAll("&#32;", " ");
		txt = txt.replaceAll("&#39;", "'");
		txt = txt.replaceAll("&#160;", " ");
		
		txt = txt.replaceAll("&#039;", "'");	
		txt = txt.replaceAll("&#8217;", "'");
		txt = txt.replaceAll("&#8220;", "\"");
		txt = txt.replaceAll("&#8221;", "\"");
		
		txt = txt.replace("+ -", "+/-");
					
		// remove links and only present text
		txt = txt.replaceAll("<a .*?>(.*?)</a>", "$1");
		txt = txt.replaceAll("</a>", "");
		txt = txt.replaceAll("<a [^>]*?>", "");
		
		txt = txt.replace("<hr>", "");
		
		// sometimes div-tags seem to be cut off inappropriately - delete their
		// garbage
//		txt = txt.replaceAll("id=.*?>", "");
//		txt = txt.replaceAll("class=.*?>", "");	
		return txt.trim();
	}
}
