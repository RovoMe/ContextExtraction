package at.rovo.parser;

import java.util.List;
import java.util.Set;
import java.util.TreeSet;

public class ParseResult 
{
	private List<Token> parsedTokens = null;
	private String title = "Unknown";
	private List<String> authors = null;
	private List<String> authorName = null;
	private String date = "Unknown";
	private String byline = "Unknonw";
	private int tokenCount = 0;
	private int wordCount = 0;
	private int tagCount = 0;
	
	public ParseResult()
	{
		
	}
	
	public ParseResult(List<Token> parsedTokens, String title, List<String> authors, String date, String byline)
	{
		this.parsedTokens = parsedTokens;
		this.title = title;
		this.authors = authors;
		this.date = date;
		this.byline = byline;
	}
	
	public List<Token> getParsedTokens()
	{
		return this.parsedTokens;
	}
	
	public void setParsedTokens(List<Token> parsedTokens)
	{
		this.parsedTokens = parsedTokens;
	}
	
	public String getTitle()
	{
		return this.title;
	}
	
	public void setTitle(String title)
	{
		this.title = title;
	}
	
	public Set<String> getAuthors()
	{
		Set<String> setAuthors = new TreeSet<String>();
		if (this.authorName != null && !this.authorName.isEmpty() && 
				!this.authorName.get(0).trim().equals(""))
		{
			for (String author : this.authorName)
			{
				if (!author.equals(""))
					setAuthors.add(author);
			}
		}
		else
		{
			for (String author : this.authors)
			{
				if (!author.equals(""))
					setAuthors.add(author);
			}
		}
		return setAuthors;
	}
	
	public void setAuthors(List<String> authors)
	{
		this.authors = authors;
	}
	
	public void setAuthorName(List<String> authors)
	{
		this.authorName = authors;
	}
	
	public String getPublishDate()
	{
		return date;
	}
	
	public void setPublishDate(String date)
	{
		if (date.startsWith("published") || date.startsWith("Published"))
			date = date.substring("published".length()+1);
		if (date.startsWith("published:") || date.startsWith("Published:"))
			date = date.substring("published:".length()+1);
		this.date = date;
	}
	
	public String getByline()
	{
		return this.byline;
	}
	
	public void setByline(String byline)
	{
		this.byline = byline;
	}
	
	public void setNumWords(int wordCount)
	{
		this.wordCount = wordCount;
	}
	
	public int getNumWords()
	{
		return this.wordCount;
	}
	
	public void setNumTags(int tagCount)
	{
		this.tagCount = tagCount;
	}
	
	public int getNumTags()
	{
		return this.tagCount;
	}
	
	public void setNumTokens(int tokenCount)
	{
		this.tokenCount = tokenCount;
	}
	
	public int getNumTokens()
	{
		return this.tokenCount;
	}
}
