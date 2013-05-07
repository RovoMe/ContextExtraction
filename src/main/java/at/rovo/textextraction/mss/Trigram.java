package at.rovo.textextraction.mss;

import java.util.List;

import at.rovo.parser.Token;

public class Trigram implements Feature
{
	private Token t1 = null;
	private Token t2 = null;
	private Token t3 = null;
	
	public Trigram(Token t1, Token t2, Token t3)
	{
		this.t1 = t1;
		this.t2 = t2;
		this.t3 = t3;
	}
	
	public Token getToken()
	{
		return this.t3;
	}
	
	@Override
	public boolean equals(Object other)
	{
		if (!(other instanceof Trigram))
			return false;
		
		Trigram t = (Trigram)other;
		return t.t1.equals(this.t1) && t.t2.equals(this.t2) && t.t3.equals(this.t3);
	}
	
	@Override
	public int hashCode()
	{
		int result = 17;
		result = 31 * result + this.t1.hashCode();
		result = 31 * result + this.t2.hashCode();
		result = 31 * result + this.t3.hashCode();
		
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
