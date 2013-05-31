package at.rovo.parser;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ParsingMetaData
{
	private boolean isTitle = false;
	private String title = "";
	private boolean isAuthorName = false;
	private List<String> authorName = new ArrayList<String>();
	private boolean isAuthor = false;
	private List<String> authors = new ArrayList<String>();
	private boolean isDate = false;
	private String date = "";
	private boolean isByline = false;
	private String bylineTag = null;
	private String byline = "";
	
	private int foundLevel = 0;
	
	public String getTitle()
	{
		return this.title;
	}
	
	public List<String> getAuthorNames()
	{
		return this.authorName;
	}
	
	public List<String> getAuthor()
	{
		return this.authors;
	}
	
	public String getDate()
	{
		// time formats:
		// Thu May 30 19:26:48 EDT 2013
		Pattern pattern = Pattern.compile(
		// DD/MM/YYYY
		// MM/DD/YYYY
		// DD/MM/YY
		// MM/DD/YY
		"(?:(\\d{1,2}/\\d{2}/\\d{2,4})|"+
		// 2012-08-14
		"(\\d{2,4}-\\d{1,2}-\\d{1,2})|"+
		// Sept. 12, 2012 or September 12, 2012 or Sept. 5th, 2004
		"((?:Jan|Feb|Mar|Apr|May|Jul|Jun|Aug|Sept|Oct|Nov|Dec|January|February|"+
		"March|April|June|July|August|September|October|November|December)[\\.|,]? "+
		"\\d{1,2}(?:st|nd|rd|th)?[,]? \\d{2,4}))");
		Matcher matcher = pattern.matcher(this.date);
		List<String> possibleDates = new ArrayList<String>();
		while (matcher.find())
			possibleDates.add(matcher.group());
		if (possibleDates.isEmpty())
			return this.date;
		return possibleDates.get(0);
	}
	
	public String getBylineTag()
	{
		return this.bylineTag;
	}
	
	public String getByline()
	{
		return this.byline;
	}
	
	public void checkTag(Tag tag)
	{
		if (tag.getHTML().equals("<title>"))
		{
			isTitle = true;
			foundLevel = tag.getLevel();
		}
		else if (tag.getHTML().equals("</title>"))
			isTitle = false;
		
		if (tag.getHTML().contains("byline"))
		{
			foundLevel = tag.getLevel();
			isByline = true;
			byline = tag.getHTML();
			bylineTag = tag.getShortTag();
		}
		
		if ((tag.isOpeningTag() && tag.getHTML().contains("date")))
		{
			foundLevel = tag.getLevel();
			isDate = true;
		}
		else if (isDate)
			isDate = false;
		
		if ((tag.isOpeningTag() && tag.getHTML().contains("\"authorName\"")))
		{
			foundLevel = tag.getLevel();
			authors.add("");
			isAuthorName = true;
		}
		else if (tag.isOpeningTag() && tag.getHTML().contains("\"author\""))
		{
			foundLevel = tag.getLevel();
			authors.add("");
			isAuthor = true;
		}
		else if (isAuthorName)
			isAuthorName = false;
		else if (isAuthor)
			isAuthor = false;
	}
	
	public void checkTag(Tag tag, String token)
	{
		
		if (tag.getHTML().contains("date") && tag.isOpeningTag())
		{
			isDate = true;
			foundLevel = tag.getLevel();
		}
		else if (isDate)
			isDate = false;
			
		if (tag.getHTML().contains("\"authorName\"") && tag.isOpeningTag())
		{
			foundLevel = tag.getLevel();
			authorName.add("");
			isAuthorName = true;
		}
		else if (isAuthorName)
			isAuthorName = false;
		else if (tag.getHTML().contains("\"author\"") && tag.isOpeningTag())
		{
			foundLevel = tag.getLevel();
			authors.add("");
			isAuthor = true;
		}
		else if (isAuthor)
			isAuthor = false;
			
		if (tag.getHTML().contains("byline") && tag.isOpeningTag())
		{
			isByline = true;
			foundLevel = tag.getLevel();
		}
		else if (isByline)
		{
			byline += tag.getHTML();
			if (tag.getShortTag().equals(bylineTag))
				isByline = false;
		}
			
		if (tag.getHTML().equals("</title>"))
			isTitle = false;
	}
	
	public void checkToken(Word word, boolean combineWords)
	{
		if (isTitle)
		{
			if (foundLevel+1 == word.getLevel())
				if (!combineWords)
					title += " "+word.getText();
				else
					title = word.getText();
			else
				this.clear();
		}
		if (isDate)
		{
			if (foundLevel+1 == word.getLevel())
				if (!combineWords)
					date += " "+word.getText();
				else
					date = word.getText();
			else
				this.clear();
		}
		if (isAuthorName)
		{
			if (foundLevel+1 == word.getLevel())
				authorName.set(authorName.size()-1, (authorName.get(authorName.size()-1)+" "+word.getText()).trim());
			else
				this.clear();
		}
		if (isAuthor)
		{
			if (foundLevel+1 == word.getLevel())
				authors.set(authors.size()-1, (authors.get(authors.size()-1)+" "+word.getText()).trim());
			else
				this.clear();
		}
		if (isByline)
		{
			if (foundLevel+1 == word.getLevel())
				byline += " "+word.getText();
			else
				this.clear();
		}
	}
	
	private void clear()
	{
		this.isAuthor = false;
		this.isAuthorName = false;
		this.isByline = false;
		this.isDate = false;
		this.isTitle = false;
	}
}
