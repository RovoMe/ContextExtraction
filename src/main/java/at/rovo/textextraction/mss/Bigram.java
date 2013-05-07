package at.rovo.textextraction.mss;

import java.util.List;

import at.rovo.parser.Token;

public class Bigram implements Feature
{
	private Token t1 = null;
	private Token t2 = null;
	
	public Bigram(Token t1, Token t2)
	{
		this.t1 = t1;
		this.t2	= t2;
	}
	
	public Token getToken()
	{
		return this.t2;
	}
	
	@Override
	public boolean equals(Object other)
	{
		if (!(other instanceof Bigram))
			return false;
		
		Bigram t = (Bigram)other;
		return t.t1.equals(this.t1) && t.t2.equals(this.t2);
	}
	
	@Override
	public int hashCode()
	{
		int result = 17;
		result = 31 * result + this.t1.hashCode();
		result = 31 * result + this.t2.hashCode();
		
		return result;
	}

	@Override
	public void addFeature(Token[] features) 
	{
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<Token> getAllFeaturesForToken() 
	{
		// TODO Auto-generated method stub
		return null;
	}
}
