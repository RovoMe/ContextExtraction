package at.rovo.textextraction.mss;

import java.util.ArrayList;
import java.util.List;

import at.rovo.parser.Token;

public class Unigram implements Feature
{
	private Token t1 = null;
	private List<Token> tokens = null;
	
	public Unigram()
	{
		tokens = new ArrayList<Token>();
	}
	
	public Token getToken()
	{
		return this.t1;
	}
	
	@Override
	public void addFeature(Token[] features) 
	{
		for (Token t : features)
			this.tokens.add(t);
	}

	@Override
	public List<Token> getAllFeaturesForToken() 
	{
		return this.tokens;
	}
	
	@Override
	public boolean equals(Object other)
	{
		if (!(other instanceof Unigram))
			return false;
		
		Unigram t = (Unigram)other;
		return t.t1.equals(this.t1);
	}
	
	@Override
	public int hashCode()
	{
		int result = 17;
		result = 31 * result + this.t1.hashCode();
		
		return result;
	}
}
