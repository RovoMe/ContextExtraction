package at.rovo.textextraction.lc;
import java.util.ArrayList;
import java.util.List;

import at.rovo.parser.Token;


public class StackValue 
{
	private Token token = null;
	private List<Token> text = new ArrayList<Token>();
	private Long value = 0L;
	
	public StackValue(Token token)
	{
		this.token = token;
		this.text.add(token);
	}
	
	public Token getToken()
	{
		return this.token;
	}
	
	public void setToken(Token token)
	{
		this.token = token;
	}
	
	public void addText(Token text)
	{
		if (!text.getText().trim().equals(""))
		{
//			text = text.replaceAll("’", "'");
//			text = text.replaceAll("–", "-");
//			text = text.replaceAll("—", "-");
//			text = text.replaceAll("“", "\"");
//			text = text.replaceAll("&#8217;", "'");
//			text = text.replaceAll("&#8220;", "\"");
//			text = text.replaceAll("&#8221;","\"");
//			text = text.replaceAll("&quot;", "\"");
//			text = text.replaceAll("&ldquo;", "\"");
//			text = text.replaceAll("&rsquo;", "'");
//			text = text.replaceAll("&rdquo;", "\"");
//			text = text.replaceAll("&#039;", "'");
//			text = text.replaceAll("&#160;", "");
//			text = text.replaceAll("&#39;", "'");
			this.text.add(text);
		}
	}
	
	public void addText(List<Token> text)
	{
		if (!this.text.equals(text))
			this.text.addAll(text);
	}
	
	public List<Token> getText()
	{
		return this.text;
	}
	
	public void addValue(Long value)
	{
		this.value += value;
	}
	
	public Long getValue()
	{
		return this.value;
	}
}
