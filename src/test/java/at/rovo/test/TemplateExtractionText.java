package at.rovo.test;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import junit.framework.Assert;
import org.junit.Test;
import at.rovo.parser.ParseResult;
import at.rovo.parser.ParseTarget;
import at.rovo.parser.Parser;
import at.rovo.parser.Token;

public class TemplateExtractionText
{
	@Test
	public void testDOMGeneration()
	{
		String s ="<html><head><title>Dies ist ein Test</title></head><body><p class=\"text\">Erster Test.</p><a href=\"www.test.at\"><img src=\"test.jpg\"/>Anchor Text</a><hr class=\"test\"/><p>Und noch ein Test. Dieser Test wird durch einen weiteren Satz erweitert, der sogar noch einen Nebensatz beinhaltet.</p></body></html>";
		
		Parser parser = new Parser();		
		parser.setParseTarget(ParseTarget.DOM);
		ParseResult res = parser.tokenize(s, false);
		List<Token> nodes = res.getParsedTokens();
		
		System.out.println(nodes);
		
		for (Token node : nodes)
		{
			if (node.getChildren() != null && node.getChildren().length > 0)
			{
				System.out.println("No: "+node.getNo());
				System.out.println("Name: "+node.getName());
				System.out.println("Parent: "+node.getParentNo());
			
				for (Token n : node.getChildren())
				{
					System.out.println("child of "+node.getName()+": "+n.getNo()+" "+n.getName());
				}
				System.out.println();
			}
		}
		
		String text0 = "Dies ist ein Test Erster Test. Anchor Text Und noch ein Test. Dieser Test wird durch einen weiteren Satz erweitert, der sogar noch einen Nebensatz beinhaltet.";
		String text1 = "Dies ist ein Test";
		String text4 = "Erster Test. Anchor Text Und noch ein Test. Dieser Test wird durch einen weiteren Satz erweitert, der sogar noch einen Nebensatz beinhaltet.";
		String text10 = "Und noch ein Test. Dieser Test wird durch einen weiteren Satz erweitert, der sogar noch einen Nebensatz beinhaltet.";

		String anchorText = "Anchor Text";
		
		Assert.assertEquals(text0, nodes.get(0).getSubtreeText());
		Assert.assertEquals(text1, nodes.get(1).getSubtreeText()); 
		Assert.assertEquals(text4, nodes.get(4).getSubtreeText());
		Assert.assertEquals(text10, nodes.get(10).getSubtreeText());
		
		Assert.assertEquals(anchorText, nodes.get(0).getSubtreeAnchorText());
		
		Assert.assertEquals(((double)anchorText.length() / text0.length()), nodes.get(0).getAnchorTextRatio());
		// no anchor text inside of node 1
		Assert.assertEquals(0.0, nodes.get(1).getAnchorTextRatio());
		Assert.assertEquals(((double)anchorText.length() / text4.length()), nodes.get(4).getAnchorTextRatio());
		// no anchor text inside of node 10
		Assert.assertEquals(0.0, nodes.get(10).getAnchorTextRatio());
		
		Assert.assertEquals(text0.split(" ").length, nodes.get(0).getSegNum());
		Assert.assertEquals(text1.split(" ").length, nodes.get(1).getSegNum());
		Assert.assertEquals(text4.split(" ").length, nodes.get(4).getSegNum());
		Assert.assertEquals(text10.split(" ").length, nodes.get(10).getSegNum());
		
		Assert.assertEquals((text0.length() - text0.replaceAll("[,|;|.]", "").length()), nodes.get(0).getPunctNum());
		Assert.assertEquals((text1.length() - text1.replaceAll("[,|;|.]", "").length()), nodes.get(1).getPunctNum());
		Assert.assertEquals((text4.length() - text4.replaceAll("[,|;|.]", "").length()), nodes.get(4).getPunctNum());
		Assert.assertEquals((text10.length() - text10.replaceAll("[,|;|.]", "").length()), nodes.get(10).getPunctNum());
	}
	
	@Test
	public void testRealPageDOMCreation() throws IOException
	{
		String url = "<html><head><title>Testpage 1</title></head><body><p>This is an example text.</p></html>";
		String expected = 
				"<html>\n"+
						"\t<head>\n"+
						"\t\t<title>\n"+
						"\t\t\tTestpage 1 \n"+
						"\t\t</title>\n"+
						"\t</head>\n"+
						"\t<body>\n"+
						"\t\t<p>\n"+
						"\t\t\tThis is an example text. \n"+
						"\t\t</p>\n"+
						"\t</body>\n"+
						"</html>";

		Parser parser = new Parser();		
		parser.setParseTarget(ParseTarget.DOM);
		ParseResult res = parser.tokenize(url, false);
		List<Token> nodes = res.getParsedTokens();
			
		String output = this.niceHTMLFormat(nodes.get(0), false);
		
//		writeFile("output.html", output);
		Assert.assertEquals(expected, output);
	}
	
	private String niceHTMLFormat(Token node, boolean endTagsIncluded)
	{
		StringBuilder builder = new StringBuilder();
		for (int i=0; i<node.getLevel(); i++)
			builder.append("\t");
		
		if (node.getText() != null)
			builder.append(node.getText());
		else
			builder.append(node.getHTML());
		
		boolean hasPrintedLeaf = false;
		for (Token child : node.getChildren())
		{
			if (child.getText() == null)
			{
				builder.append("\n");
				builder.append(this.niceHTMLFormat(child, endTagsIncluded));
				hasPrintedLeaf = false;
			}
			else
			{
				if (!hasPrintedLeaf)
				{
					builder.append("\n");
					for (int i=0; i<child.getLevel(); i++)
						builder.append("\t");
				}
				builder.append(child.getText());
				builder.append(" ");
				hasPrintedLeaf = true;
			}
		}
		if (!endTagsIncluded && node.getText() == null && !node.getHTML().endsWith("/>"))
		{
			builder.append("\n");
			for (int i=0; i<node.getLevel(); i++)
				builder.append("\t");
			builder.append("</");
			builder.append(node.getName().replace("<", ""));
		}
		
		return builder.toString();
	}
	
	@SuppressWarnings("unused")
	private static void writeFile(String file, String content) throws IOException
	{
		System.out.print("Writing file '"+file+"'");
	    PrintWriter out = new PrintWriter(new FileWriter(file));
	         
	    // Write text to file
	    out.println(content);
	    out.close();
	    try
		{
			Thread.sleep(1000);
		}
		catch (InterruptedException e)
		{
			e.printStackTrace();
		}
	    System.out.println(" ... DONE");
	}
}
