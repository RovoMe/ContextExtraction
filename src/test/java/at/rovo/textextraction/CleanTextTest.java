package at.rovo.textextraction;

import at.rovo.parser.Parser;
import at.rovo.parser.Token;
import java.util.Dictionary;
import java.util.Hashtable;
import java.util.List;

public class CleanTextTest
{
    private String test =
            "<div class=\"main-image-info\" style=\"width:275px\">A user on 360cities.net created a 360 degree panorama of Mars using pictures&hellip; (360cities.net)</div>" +
            "</div>" +
            "<div id=\"mod-a-body-first-para\" style=\"margin-right: 280px;\" class=\"mod-latarticlesarticletext mod-articletext\">" +
            "<p>A 360 degree panorama of Mars has hit the Web, giving you a look from the surface of our neighboring  red planet.</p>" +
            "<p>The panorama, which you can check out <a href=\"http://www.360cities.net/image/curiosity-rover-martian-solar-day-2#74.41,-0.55,110.0\">here</a>, gives an incredible detailed look at Mars.</p>" +
            "<p>Look ahead and you can see a range of mountains in the distance set below the tan colored sky that fades softly into the similarly hued surface of Mars.</p>" +
            "</div>" +
            "</div>" +
            "<div class=\"float\" style=\"clear:both;height:1px;line-height:1px;\">" +
            "<img src=\"/images/pixel.gif\" height=\"1\" width=\"1\" alt=\"\" />" +
            "</div>" +
            "<div id=\"mod-ctr-lt-in-top\" class=\"mod-latarticlesadcpc mod-adcpc with-fourth-cpc\">" +
            "</div>" +
            "<div id=\"mod-a-body-after-first-para\" class=\"mod-latarticlesarticletextwithadcpc mod-latarticlesarticletext mod-articletext\">" +
            "<p>If you look to the sky, you can see the sun glaring down on Curiosity, and if you look below, you get a detailed look at both the rocks and dirt of the planet as well as the rover, which looks like something out of a \"Transformers\" movie.</p>" +
            "<p>The panorama is hosted on 360cities.net, which is a website dedicated to panoramic photos.</p>" +
            "<p>Andrew Bodrov, a user on the site, put together the panorama, but he doesn't give too many details about it in the post other than that the photos came from Curiosity's second day on Mars.</p>" +
            "<p>The vast majority of us will very likely never get to visit this planet in person, but at least technology gives us the opportunity to see it through the cameras on Curiosity.</p>" +
            "<p><strong>ALSO:</strong></p>" +
            "<p><a href=\"http://www.latimes.com/business/technology/la-fi-tn-iphone-5-pre-orders-20120813,0,926655.story\">Pre orders for iPhone 5 to start Sept. 12, report says</a></p>" +
            "<p><a href=\"http://www.latimes.com/business/technology/la-fi-tn-google-plus-vanity-urls-20120813,0,885326.story\">Google+ gets custom URLs, begins rollout to verified accounts</a></p>" +
            "<p><a href=\"http://www.latimes.com/business/technology/la-fi-tn-nbc-zuckerberg-eisenberg-20120813,0,3468799.story\">";

    private static Dictionary<String, List<String>> commonTags = new Hashtable<>();

    public static void main(String[] args)
    {
        CleanTextTest ctt = new CleanTextTest();
        Parser parser = new Parser();
        List<Token> tokens = parser.tokenize(ctt.test, false).getParsedTokens();
        System.out.println(tokens);
        List<Token> cleanedTokens = TextUtils.cleanText(tokens, commonTags);
        System.out.println(cleanedTokens);
    }
}
