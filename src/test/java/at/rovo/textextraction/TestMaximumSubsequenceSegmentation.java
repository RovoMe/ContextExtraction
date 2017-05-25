package at.rovo.textextraction;

import at.rovo.parser.Parser;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import at.rovo.textextraction.mss.MaximumSubsequenceSegmentation;
import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;

public class TestMaximumSubsequenceSegmentation extends MaximumSubsequenceSegmentation
{
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @Test
    public void kMaximumSubsequences()
    {
        // example as presented in the paper:
        // 'A linear time algorithm for finding all maximal scoring subsequences'
        List<Double> data = new ArrayList<>(Arrays.asList(4., -5., 3., -3., 1., 2., -2., 2.));

        List<List<Double>> I = new ArrayList<>();
        List<Double> L = new ArrayList<>();
        List<Double> R = new ArrayList<>();
        List<Integer> startPos = new ArrayList<>();
        double kumulScore = this.kMaximumSubsequences(data, I, L, R, startPos);
        LOG.debug("original sequence: " + data);
        LOG.debug("subsequences: " + I);
        LOG.debug("starting positions: " + startPos);
        // Setup of expected data
        List<Double> i1 = Collections.singletonList(4.);
        List<Double> i2 = Collections.singletonList(3.);
        List<Double> i3 = new ArrayList<>(Arrays.asList(1., 2.));
        List<Double> i4 = Collections.singletonList(2.);
        List<List<Double>> i = new ArrayList<>(Arrays.asList(i1, i2, i3, i4));
        List<Double> l = new ArrayList<>(Arrays.asList(0., -1., -1., 0.));
        List<Double> r = new ArrayList<>(Arrays.asList(4., 2., 2., 2.));
        // test
        assertThat(kumulScore, is(equalTo(2.)));
        assertThat(I, is(equalTo(i)));
        assertThat(L, is(equalTo(l)));
        assertThat(R, is(equalTo(r)));

        // first addition
        data.add(-2.);
        kumulScore = this.kMaximumSubsequences(data, I, L, R, startPos);
        LOG.debug("original sequence: " + data);
        LOG.debug("subsequences: " + I);
        LOG.debug("starting positions: " + startPos);
        assertThat(kumulScore, is(equalTo(0.)));
        assertThat(I, is(equalTo(i)));
        assertThat(L, is(equalTo(l)));
        assertThat(R, is(equalTo(r)));

        // next run
        data.add(1.);
        kumulScore = this.kMaximumSubsequences(data, I, L, R, startPos);
        LOG.debug("original sequence: " + data);
        LOG.debug("subsequences: " + I);
        LOG.debug("starting positions: " + startPos);
        // add expected data
        List<Double> i5 = Collections.singletonList(1.);
        i.add(i5);
        l.add(0.);
        r.add(1.);
        // test
        assertThat(kumulScore, is(equalTo(1.)));
        assertThat(I, is(equalTo(i)));
        assertThat(L, is(equalTo(l)));
        assertThat(R, is(equalTo(r)));

        // next run
        data.add(5.);
        kumulScore = this.kMaximumSubsequences(data, I, L, R, startPos);
        LOG.debug("original sequence: " + data);
        LOG.debug("subsequences: " + I);
        LOG.debug("starting positions: " + startPos);
        // add expected data
        i.remove(4);
        i.remove(3);
        i3.add(-2.);
        i3.add(2.);
        i3.add(-2.);
        i3.add(1.);
        i3.add(5.);
        l.remove(4);
        l.remove(3);
        r.set(2, r.get(r.size() - 1) + 5.);
        r.remove(4);
        r.remove(3);
        // test
        assertThat(kumulScore, is(equalTo(6.)));
        assertThat(I, is(equalTo(i)));
        assertThat(L, is(equalTo(l)));
        assertThat(R, is(equalTo(r)));
    }

    @Test
    public void testTextCleaning()
    {
        // part extracted from http://edition.cnn.com/2012/08/13/world/europe/norway-massacre-report/index.html?hpt=hp_t3
        String test = "<a name=\"em1\"></a>" +
                      "<div class=\"cnn_strylftcntnt cnn_strylftcexpbx\" id=\"expand18\">" +
                      "  <div style=\"display: none;\" class=\"cnn_strylceclbtn\">" +
                      "    <img src=\"http://i.cdn.turner.com/cnn/.e/img/3.0/mosaic/bttn_close.gif\" alt=\"\" border=\"0\" height=\"23\" width=\"58\">" +
                      "  </div>" +
                      "  <div style=\"display: none;\" id=\"videoContainerexpand18\" class=\"parentMediaContainer\">" +
                      "    <div id=\"videoContainerexpand18Media\" class=\"mediaContainer\">" +
                      "      <div class=\"cnnvideo_wrapper\" id=\"videoContainerexpand18Media-videowrapper\">" +
                      "        <img src=\"http://i2.cdn.turner.com/cnn/dam/assets/120425061409-nc-pracon-norway-survivor-00031603-story-body.jpg\" alt=\"Watch this video\" height=\"360\" width=\"640\">" +
                      "        <a class=\"cnnvideo_clicklink\" href=\"#\" title=\"Click to watch this video\">" +
                      "          <div class=\"cnnvideo_playcontainer cnnvideo_click_standard\" style=\"top:138px;left:220px;\">" +
                      "          </div>" +
                      "        </a>" +
                      "      </div>" +
                      "    </div>" +
                      "  </div>" +
                      "  <div style=\"cursor: pointer;\" id=\"clickToPlayvideoContainerexpand18\" class=\"clickToPlay\">" +
                      "  </div>" +
                      "  <img style=\"cursor: pointer;\" src=\"http://i2.cdn.turner.com/cnn/dam/assets/120425061409-nc-pracon-norway-survivor-00031603-story-body.jpg\" alt=\"\" class=\"box-image\" border=\"0\" height=\"120\" width=\"214\">" +
                      "  <cite class=\"expCaption\">" +
                      "    <span>Norway massacre survivor talks </span>" +
                      "  </cite>" +
                      "</div>" +
                      "<p class=\"cnn_storypgraphtxt_cnn_storypgraph8\">Authorities say he roamed the island shooting at campers, killing 69 people before members of an elite Norwegian police unit took him into custody.</p>";
        Parser parser = new Parser();

        List<Token> tokens = parser.tokenize(test, false).getParsedTokens();
        List<Token> actual = this.cleanText(tokens);
        StringBuilder builder = new StringBuilder();
        boolean blank = false;
        for (Token token : actual)
        {
            if (blank && token instanceof Word)
            {
                builder.append(" ");
            }

            if (token instanceof Word)
            {
                builder.append(token.getText());
                blank = true;
            }
            else
            {
                builder.append(token.getHTML());
                blank = false;
            }
        }
        assertThat(builder.toString(), is(equalTo("<p class=\"cnn_storypgraphtxt_cnn_storypgraph8\">Authorities say he " +
                                                  "roamed the island shooting at campers, killing 69 people before " +
                                                  "members of an elite Norwegian police unit took him into custody.</p>")));
    }

    @Override
    public String predictText(String url) throws ExtractionException
    {
        fail("Not yet implemented");
        return null;
    }

    @Override
    public List<String> predictText(List<String> urls) throws ExtractionException
    {
        fail("Not yet implemented");
        return null;
    }
}
