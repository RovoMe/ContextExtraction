package at.rovo;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.net.URL;
import java.net.HttpURLConnection;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class UrlReader 
{
	private static Logger logger = LogManager.getLogger(UrlReader.class.getName());
	
	private String cookie = null;
	
	private String originURL = null;
	private String realURL = null;
	
	public UrlReader()
	{
		
	}
	
	public BufferedReader read(String url) throws IOException
	{
		// used an approach presented by tim_yates at stackoverflow.com
		// (http://stackoverflow.com/questions/7055957/httpurlconnection-to-get-title-of-the-content-and-got-moved-permanently)
		// as pages from nytimes require cookies
		HttpURLConnection httpConn = null;
		InputStreamReader reader = null;
		this.originURL = url;
		this.realURL = url;
		while (url != null)
		{
			httpConn = (HttpURLConnection)new URL(url).openConnection();
			httpConn.setInstanceFollowRedirects(false);
				
			// If we got a cookie last time round, then add it to our request
			if (cookie != null)
				httpConn.setRequestProperty("Cookie", cookie);
				
			httpConn.connect();
				
			// Get the response code, and the location to jump to (in case of a redirect)
//			int responseCode = httpConn.getResponseCode();
			url = httpConn.getHeaderField("Location");
			if (url != null)
				this.realURL = url;
			
			// Try and get a cookie the site will set, we will pass this next time round
			cookie = httpConn.getHeaderField("Set-Cookie");
			
			reader = new InputStreamReader(httpConn.getInputStream(), "UTF8");
//			reader = new InputStreamReader(new URL(url).openStream(), "8859_1");
		}
		return new BufferedReader(reader);
	}
	
	public String readPage(String url)
	{
		StringBuffer buffer = new StringBuffer();
		try
		{
			BufferedReader reader = read(url);
			String line = reader.readLine();
			String curHTML = "";
			while (line != null)
			{
				curHTML = buffer.toString();
				if (curHTML.endsWith(" ") && !line.startsWith(" "))
					buffer.append(line);
				else if (curHTML.endsWith(" ") && line.startsWith(" "))
					buffer.append(line.trim());
				else if (!curHTML.endsWith(" ") && line.startsWith(" "))
					buffer.append(line);
				else
					buffer.append(" "+line);
				line = reader.readLine();
			}
		}
		catch(IOException ioEx)
		{
			logger.warn("Could not read "+url+"! Reason: "+ioEx.getLocalizedMessage(), ioEx);
			return null;
		}
		return buffer.toString();
	}
	
	public String getOriginURL()
	{
		return this.originURL;
	}
	
	public String getRealURL()
	{
		return this.realURL;
	}
	
	public static void main(String[] args) throws IOException
	{		
		UrlReader reader = new UrlReader();
		String url = args[0];
		BufferedReader br = reader.read(url);
		logger.debug("Reading origin url: "+reader.getOriginURL());
		logger.debug("Reading real url: "+reader.getRealURL());
		String line = br.readLine();
		while (line != null)
		{
			logger.debug(line);
			line = br.readLine();
		}
	}
}
