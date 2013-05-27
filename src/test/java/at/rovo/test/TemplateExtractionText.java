package at.rovo.test;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import junit.framework.Assert;
import org.junit.Test;
import at.rovo.parser.HTMLNode;
import at.rovo.parser.Parser;

public class TemplateExtractionText
{
	@Test
	public void testDOMGeneration()
	{
		String s ="<html><head><title>Dies ist ein Test</title></head><body><p class=\"text\">Erster Test.</p><a href=\"www.test.at\"><img src=\"test.jpg\"/>Anchor Text</a><hr class=\"test\"/><p>Und noch ein Test. Dieser Test wird durch einen weiteren Satz erweitert, der sogar noch einen Nebensatz beinhaltet.</p></body></html>";
		HTMLNode[] nodes = Parser.getDOMTree(s, false, false, true);
//		for (HTMLNode node : nodes)
//		{
//			if (node.getChildren() != null && node.getChildren().length > 0)
//			{
//				System.out.println("No: "+node.getNo());
//				System.out.println("Name: "+node.getName());
//				System.out.println("Parent: "+node.getParentNo());
//			
//				for (HTMLNode n : node.getChildren())
//				{
//					System.out.println("child of "+node.getName()+": "+n.getNo()+" "+n.getName());
//				}
//				System.out.println();
//			}
//		}
		
		String text0 = "Dies ist ein Test Erster Test. Anchor Text Und noch ein Test. Dieser Test wird durch einen weiteren Satz erweitert, der sogar noch einen Nebensatz beinhaltet.";
		String text1 = "Dies ist ein Test";
		String text9 = "Erster Test. Anchor Text Und noch ein Test. Dieser Test wird durch einen weiteren Satz erweitert, der sogar noch einen Nebensatz beinhaltet.";
		String text19 = "Und noch ein Test. Dieser Test wird durch einen weiteren Satz erweitert, der sogar noch einen Nebensatz beinhaltet.";

		String anchorText = "Anchor Text";
		
		Assert.assertEquals(text0, nodes[0].getSubtreeText());
		Assert.assertEquals(text1, nodes[1].getSubtreeText()); 
		Assert.assertEquals(text9, nodes[9].getSubtreeText());
		Assert.assertEquals(text19, nodes[19].getSubtreeText());
		
		Assert.assertEquals(anchorText, nodes[0].getSubtreeAnchorText());
		
		Assert.assertEquals(((double)anchorText.length() / text0.length()), nodes[0].getAnchorTextRatio());
		// no anchor text inside of node 1
		Assert.assertEquals(0.0, nodes[1].getAnchorTextRatio());
		Assert.assertEquals(((double)anchorText.length() / text9.length()), nodes[9].getAnchorTextRatio());
		// no anchor text inside of node 19
		Assert.assertEquals(0.0, nodes[19].getAnchorTextRatio());
		
		Assert.assertEquals(text0.split(" ").length, nodes[0].getSegNum());
		Assert.assertEquals(text1.split(" ").length, nodes[1].getSegNum());
		Assert.assertEquals(text9.split(" ").length, nodes[9].getSegNum());
		Assert.assertEquals(text19.split(" ").length, nodes[19].getSegNum());
		
		Assert.assertEquals((text0.length() - text0.replaceAll("[,|;|.]", "").length()), nodes[0].getPunctNum());
		Assert.assertEquals((text1.length() - text1.replaceAll("[,|;|.]", "").length()), nodes[1].getPunctNum());
		Assert.assertEquals((text9.length() - text9.replaceAll("[,|;|.]", "").length()), nodes[9].getPunctNum());
		Assert.assertEquals((text19.length() - text19.replaceAll("[,|;|.]", "").length()), nodes[19].getPunctNum());
	}
	
	@Test
	public void testRealPageDOMCreation() throws IOException
	{
		String url = "<html><head><title>Testpage 1</title></head><body><p>This is an example text.</p></html>";
//		String url = "http://www.washingtonpost.com/business/economy/romney-chose-paul-ryan-to-shift-the-campaign-debate-will-the-gamble-pay-off/2012/08/13/f9ae54e2-e557-11e1-9739-eef99c5fb285_story.html";
//		String url1 = "<html><head><title>Testpage 1</title></head><body><p>This is an example text.</p></html>";
//		String url2 = "<html><head><title>Testpage 2</title></head><body><p>This is a further example text.</p><p>It even contains a sentence more.</p></html>";

		
		HTMLNode[] nodes = Parser.getDOMTree(url);
		
		writeFile("output3.html", this.niceHTMLFormat(nodes[0], false));
	}
	
	private String niceHTMLFormat(HTMLNode node, boolean endTagsIncluded)
	{
		StringBuilder builder = new StringBuilder();
		for (int i=0; i<node.getLevel(); i++)
			builder.append("\t");
		
		if (node.getText() != null)
			builder.append(node.getText());
		else
			builder.append(node.getHTML());
		
		boolean hasPrintedLeaf = false;
		for (HTMLNode child : node.getChildren())
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
