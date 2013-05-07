package at.rovo.textextraction.mss;

import java.util.List;

import at.rovo.parser.Token;

public interface Feature 
{
	 public Token getToken();
	 public void addFeature(Token[] features);
	 public List<Token> getAllFeaturesForToken();
}
