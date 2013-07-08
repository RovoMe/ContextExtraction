package at.rovo.test;

import java.util.ArrayList;
import java.util.Dictionary;
import java.util.Hashtable;
import java.util.List;
import java.util.Stack;

import at.rovo.parser.Parser;
import at.rovo.parser.Tag;
import at.rovo.parser.Token;

public class CleanTextTest 
{
	private String test = "<div class=\"main-image-info\" style=\"width:275px\">A user on 360cities.net created a 360 degree panorama of Mars using pictures&hellip; (360cities.net)</div>"+
	"</div>"+
	"<div id=\"mod-a-body-first-para\" style=\"margin-right: 280px;\" class=\"mod-latarticlesarticletext mod-articletext\">"+
		"<p>A 360 degree panorama of Mars has hit the Web, giving you a look from the surface of our neighboring  red planet.</p>"+
		"<p>The panorama, which you can check out <a href=\"http://www.360cities.net/image/curiosity-rover-martian-solar-day-2#74.41,-0.55,110.0\">here</a>, gives an incredible detailed look at Mars.</p>"+
		"<p>Look ahead and you can see a range of mountains in the distance set below the tan colored sky that fades softly into the similarly hued surface of Mars.</p>"+
	"</div>"+
"</div>"+
"<div class=\"float\" style=\"clear:both;height:1px;line-height:1px;\">"+
	"<img src=\"/images/pixel.gif\" height=\"1\" width=\"1\" alt=\"\" />"+
"</div>"+
"<div id=\"mod-ctr-lt-in-top\" class=\"mod-latarticlesadcpc mod-adcpc with-fourth-cpc\">"+
"</div>"+
"<div id=\"mod-a-body-after-first-para\" class=\"mod-latarticlesarticletextwithadcpc mod-latarticlesarticletext mod-articletext\">"+
	"<p>If you look to the sky, you can see the sun glaring down on Curiosity, and if you look below, you get a detailed look at both the rocks and dirt of the planet as well as the rover, which looks like something out of a \"Transformers\" movie.</p>"+
	"<p>The panorama is hosted on 360cities.net, which is a website dedicated to panoramic photos.</p>"+
	"<p>Andrew Bodrov, a user on the site, put together the panorama, but he doesn't give too many details about it in the post other than that the photos came from Curiosity's second day on Mars.</p>"+
	"<p>The vast majority of us will very likely never get to visit this planet in person, but at least technology gives us the opportunity to see it through the cameras on Curiosity.</p>"+
	"<p><strong>ALSO:</strong></p>"+
	"<p><a href=\"http://www.latimes.com/business/technology/la-fi-tn-iphone-5-pre-orders-20120813,0,926655.story\">Pre orders for iPhone 5 to start Sept. 12, report says</a></p>"+
	"<p><a href=\"http://www.latimes.com/business/technology/la-fi-tn-google-plus-vanity-urls-20120813,0,885326.story\">Google+ gets custom URLs, begins rollout to verified accounts</a></p>"+
	"<p><a href=\"http://www.latimes.com/business/technology/la-fi-tn-nbc-zuckerberg-eisenberg-20120813,0,3468799.story\">";
	
	private Dictionary<String, List<String>> commonTags = new Hashtable<String, List<String>>();
	
	public static void main(String[] args)
	{
		CleanTextTest ctt = new CleanTextTest();
		Parser parser = new Parser();
		List<Token> tokens = parser.tokenize(ctt.test, false).getParsedTokens();
		System.out.println(tokens);
		List<Token> cleanedTokens = ctt.cleanText(tokens);
		System.out.println(cleanedTokens);
	}
	
	public List<Token> cleanText(List<Token> text)
	{
		Stack<List<Token>> tagStack = new Stack<List<Token>>();
		// add a root-level to the stack
		tagStack.push(new ArrayList<Token>());
		List<Token> cleaned = new ArrayList<Token>();
		for (Token token : text)
		{
			// we have found a tag - when it is a starting tag add a new sequence to the stack
			// a closing tag should result in taking away the whole sequence (from start to end
			// tag) from the stack
			// if the tag is an image or break symbol add it to the parent
			if (token instanceof Tag)
			{
				Tag tag = (Tag)token;
				// ignore comments
				if (tag.isComment())
					continue;
				
				// check if tag is in common tags
				List<String> sources = this.commonTags.get(tag.getShortTag());
				if (sources != null && sources.size() < 2)
					tag.setAsUndefined();
				
				// add <IMG> and <BR> tags in case they are not self-closed to the parent tag
				if (tag.isOpeningTag() && tag.getShortTag().equals("img") || tag.getShortTag().equals("br") && !tag.isInlineCloseingTag())
				{
					// ignore images and line-breaks --> no content to analyze
					// tagStack.peek().add(tag);
				}
				// push a new token list on the stack to fill it with elements
				else if (tag.isOpeningTag())
				{
					if (!tag.isInlineCloseingTag())
					{
						List<Token> subElement = new ArrayList<Token>();
						subElement.add(tag);
						tagStack.push(subElement);
					}
				}
				// closing tag found - take it from the stack and decide based on its content
				// if the tag should be kept or thrown away
				else
				{
					if (tagStack.isEmpty())
						continue;
					tagStack.peek().add(token);
					// as the first part of a sequence could be a word which
					// is followed by a closing tag - ignore that case
					Tag start = null;
					for (int i=0; i<tagStack.peek().size(); i++)
					{
						Token _start = tagStack.peek().get(i);
						if (_start instanceof Tag && _start != token)
						{
							start = (Tag)_start;
							break;
						}
					}
					if (start == null)
						continue;
					
					// closing tag equals the starting tag
					if (tag.getShortTag().equals(start.getShortTag()))
					{
						// remove the contents of any <IFRAME> or <TABLE> tag pair
						if (start.getShortTag().equals("table") || start.getShortTag().equals("iframe") || 
								start.getShortTag().equals("form") || start.getShortTag().equals("style") ||
								start.getShortTag().equals("script") || start.getShortTag().equals("fb") ||
								start.getShortTag().equals("g") || start.getShortTag().equals("blockquote") ||
								start.getShortTag().equals("cite")) //|| start.getShortTag().equals("unknown"))
							tagStack.pop();
						// remove empty tags
						else if (tagStack.peek().size()==2)
							tagStack.pop();
						// remove links that do not link to other pages
						else if (start.getShortTag().equals("a") && !start.getHTML().contains("href=\"http://"))
							tagStack.pop();
						// remove li tags that only contain a link
						else if (start.getShortTag().equals("li"))
						{
							boolean remove = false;
							if (tagStack.peek().size()>3 && 
									tagStack.peek().get(0).getHTML().startsWith("<li") && 
									tagStack.peek().get(1).getHTML().startsWith("<a ") &&
									tagStack.peek().get(tagStack.peek().size()-2).getHTML().startsWith("</a") &&
									tagStack.peek().get(tagStack.peek().size()-1).getHTML().startsWith("</li"))
								remove = true;
							
							if (remove == true)
								tagStack.pop();
							else
								// if not, append the li-tag to its parent tag
								for (Token t : tagStack.pop())
								{
									if (tagStack.isEmpty())
										tagStack.push(new ArrayList<Token>());
									tagStack.peek().add(t);
								}	
						}
						// remove p tags that only contain a link
						else if (start.getShortTag().equals("p"))
						{
							boolean remove = false;
							if (tagStack.peek().size()>3 && 
									tagStack.peek().get(0).getHTML().startsWith("<p") && 
									tagStack.peek().get(1).getHTML().startsWith("<a ") &&
									tagStack.peek().get(tagStack.peek().size()-2).getHTML().startsWith("</a") &&
									tagStack.peek().get(tagStack.peek().size()-1).getHTML().startsWith("</p"))
								remove = true;
							
							if (remove == true)
								tagStack.pop();
							else
								// if not, append the p-tag to its parent tag
								for (Token t : tagStack.pop())
								{
									if (tagStack.isEmpty())
										tagStack.push(new ArrayList<Token>());
									tagStack.peek().add(t);
								}	
						}
						// remove the contents of any <DIV> tag pair ...
						else if (start.getShortTag().equals("div"))
						{
							// only <div..> and </div> element - can be removed
							if (tagStack.peek().size()==2)
							{
								tagStack.pop();
								continue;
							}
							// more elements have been found inside the <div> tags
							// look if there is a unwanted element inside the <div> tag
							boolean delete = false;
							for (Token t : tagStack.peek())
							{
								if (t instanceof Tag)
								{
									Tag _tag = (Tag)t;
									// ... that contains a hyperlink (<A>) ...
									if (//_tag.getShortTag().equals("a") || 
											// ... <IFRAME> ...
											_tag.getShortTag().equals("iframe") ||
											// ... <TABLE> ...
											_tag.getShortTag().equals("table") ||
											// ... <IMG> ...
											//_tag.getShortTag().equals("img") ||
											// ... <EMBED> ...
											_tag.getShortTag().equals("embed") ||
											// ... <APPLET> ...
											_tag.getShortTag().equals("applet") ||
											// ... or <OBJECT>
											_tag.getShortTag().equals("object"))
									{
										delete = true;
										break;
									}
								}	
							}
							// we found a link/iframe/table/img/embed/applet or object tag inside a div-tag
							// remove the whole div-tag
							if (delete == true)
								tagStack.pop();
							else
							{
								// check if the div-tag contains a p-element
								List<Token> divTokens = tagStack.peek();
//								int count = 0;
								boolean found = false;
								for (Token t : divTokens)
								{
									if (t instanceof Tag)
									{
										Tag _tag = (Tag)t;
//										if (_tag.isOpeningTag() && _tag.getShortTag().equals("div"))
//											count++;
//										if (!_tag.isOpeningTag() && _tag.getShortTag().equals("div"))
//											count--;
										if (_tag.getShortTag().equals("p"))
										{
											found = true;
											break;
										}
									}
								}
								// only add div-tags to the previous elements if they contain
								// usable data - in example of a p-element
//								if (count == 0 && found == true)
//								{
//									// if not, append the div-tag to its parent tag
//									for (Token t : tagStack.pop())
//									{
//										if (tagStack.isEmpty())
//											tagStack.push(new ArrayList<Token>());
//										tagStack.peek().add(t);
//									}
//								}
								if (found == false) // remove the div-tag which contains only useless data
									tagStack.pop();
							}
						}
						else
						{
							// as the end of of sub element was reached add it to the parent element
							for (Token t : tagStack.pop())
							{
								if (tagStack.isEmpty())
									tagStack.push(new ArrayList<Token>());
								tagStack.peek().add(t);
							}
						}
					}
				}					
			}
			else
			{
				if (tagStack != null && !tagStack.isEmpty() && tagStack.get(0) != null)
					tagStack.peek().add(token);
				else
				{
					List<Token> element = new ArrayList<Token>();
					element.add(token);
					tagStack.push(element);
				}
			}
		}
					
		// ignore output of div- and unknown-tags
		for (int i=0; i<tagStack.size(); i++)
			for (Token t : tagStack.get(i))
				if (!t.getHTML().startsWith("<div") && !t.getHTML().startsWith("</div") &&
						!t.getHTML().startsWith("<unknown") && !t.getHTML().startsWith("</unknown"))
					cleaned.add(t);
		
		return cleaned;
	}
}
