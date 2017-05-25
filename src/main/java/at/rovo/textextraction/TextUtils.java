package at.rovo.textextraction;

import at.rovo.parser.Tag;
import at.rovo.parser.Token;
import at.rovo.parser.Word;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.List;
import java.util.Stack;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class TextUtils
{
    private TextUtils() {

    }

    public static List<Token> cleanText(List<Token> text, Dictionary<String, List<String>> commonTags) {
        Stack<List<Token>> tagStack = new Stack<>();
        // add a root-level to the stack
        tagStack.push(new ArrayList<>());
        for (Token token : text)
        {
            // we have found a tag - when it is a starting tag add a new sequence to the stack a closing tag should
            // result in taking away the whole sequence (from start to end tag) from the stack if the tag is an image or
            // break symbol add it to the parent
            if (token instanceof Tag)
            {
                Tag tag = (Tag) token;
                // ignore comments
                if (tag.isComment())
                {
                    continue;
                }

                // check if tag is in common tags
                List<String> sources = commonTags.get(tag.getShortTag());
                if (sources != null && sources.size() < 2)
                {
                    tag.setAsUndefined();
                }

                // add <IMG> and <BR> tags in case they are not self-closed to the parent tag
                if (tag.isOpeningTag() && tag.getShortTag().equals("img") ||
                    tag.getShortTag().equals("br") && !tag.isInlineClosingTag())
                {
                    // ignore images and line-breaks --> no content to analyze
                    // tagStack.peek().add(tag);
                }
                // push a new token list on the stack to fill it with elements
                else if (tag.isOpeningTag())
                {
                    if (!tag.isInlineClosingTag())
                    {
                        List<Token> subElement = new ArrayList<>();
                        subElement.add(tag);
                        tagStack.push(subElement);
                    }
                }
                // closing tag found - take it from the stack and decide based on its content if the tag should be kept
                // or thrown away
                else
                {
                    if (tagStack.isEmpty())
                    {
                        continue;
                    }
                    tagStack.peek().add(token);
                    // as the first part of a sequence could be a word which is followed by a closing tag - ignore that
                    // case
                    Tag start = null;
                    for (int i = 0; i < tagStack.peek().size(); i++)
                    {
                        Token _start = tagStack.peek().get(i);
                        if (_start instanceof Tag && _start != token)
                        {
                            start = (Tag) _start;
                            break;
                        }
                    }
                    if (start == null)
                    {
                        continue;
                    }

                    // closing tag equals the starting tag
                    if (tag.getShortTag().equals(start.getShortTag()))
                    {
                        // remove the contents of any <IFRAME> or <TABLE> tag pair
                        if (start.getShortTag().equals("table") || start.getShortTag().equals("iframe") ||
                            start.getShortTag().equals("form") || start.getShortTag().equals("style") ||
                            start.getShortTag().equals("script") || start.getShortTag().equals("fb") ||
                            start.getShortTag().equals("g") || start.getShortTag().equals("blockquote") ||
                            start.getShortTag().equals("cite") || start.getShortTag().equals("figure") ||
                            start.getShortTag().equals("figcaption")) // || start.getShortTag().equals("unknown"))
                        {
                            tagStack.pop();
                        }
                        // remove empty tags
                        else if (tagStack.peek().size() == 2)
                        {
                            tagStack.pop();
                        }
                        // remove links that do not link to other pages
                        // else if (start.getShortTag().equals("a") && !start.getHTML().contains("href=\"http://"))
                        // {
                        //     tagStack.pop();
                        // }
                        // remove li tags that only contain a link
                        else if (start.getShortTag().equals("li"))
                        {
                            boolean remove = false;
                            if (tagStack.peek().size() > 3 && tagStack.peek().get(0).getHTML().startsWith("<li") &&
                                tagStack.peek().get(1).getHTML().startsWith("<a ") &&
                                tagStack.peek().get(tagStack.peek().size() - 2).getHTML().startsWith("</a") &&
                                tagStack.peek().get(tagStack.peek().size() - 1).getHTML().startsWith("</li"))
                            {
                                remove = true;
                            }

                            removeOrAppendToParentTag(tagStack, remove);
                        }
                        // remove p tags that only contain a link
                        else if (start.getShortTag().equals("p"))
                        {
                            boolean remove = false;
                            if (tagStack.peek().size() > 3 && tagStack.peek().get(0).getHTML().startsWith("<p") &&
                                tagStack.peek().get(1).getHTML().startsWith("<a ") &&
                                tagStack.peek().get(tagStack.peek().size() - 2).getHTML().startsWith("</a") &&
                                tagStack.peek().get(tagStack.peek().size() - 1).getHTML().startsWith("</p"))
                            {
                                remove = true;
                            }

                            removeOrAppendToParentTag(tagStack, remove);
                        }
                        // remove the contents of any <DIV> tag pair ...
                        else if (start.getShortTag().equals("div"))
                        {
                            // only <div..> and </div> element - can be removed
                            if (tagStack.peek().size() == 2)
                            {
                                tagStack.pop();
                                continue;
                            }
                            // more elements have been found inside the <div> tags. Look if there is a unwanted element
                            // inside the <div> tag
                            boolean delete = false;
                            for (Token t : tagStack.peek())
                            {
                                if (t instanceof Tag)
                                {
                                    Tag _tag = (Tag) t;
                                    // ... that contains a hyperlink (<A>) ...
                                    if (// _tag.getShortTag().equals("a") ||
                                        // ... <IFRAME> ...
                                            _tag.getShortTag().equals("iframe") ||
                                            // ... <TABLE> ...
                                            _tag.getShortTag().equals("table") ||
                                            // ... <IMG> ...
                                            // _tag.getShortTag().equals("img")
                                            // ||
                                            // ... <EMBED> ...
                                            _tag.getShortTag().equals("embed") ||
                                            // ... <APPLET> ...
                                            _tag.getShortTag().equals("applet") ||
                                            // ... <OBJECT>
                                            _tag.getShortTag().equals("object"))
                                    {
                                        delete = true;
                                        break;
                                    }
                                }
                            }
                            // we found a link/iframe/table/img/embed/applet or object tag inside a div-tag remove the
                            // whole div-tag
                            if (delete)
                            {
                                tagStack.pop();
                            }
                            else
                            {
                                // check if the div-tag contains a p-element
                                List<Token> divTokens = tagStack.peek();
                                boolean found = false;
                                for (Token t : divTokens)
                                {
                                    if (t instanceof Tag)
                                    {
                                        Tag _tag = (Tag) t;
                                        if (_tag.getShortTag().equals("p"))
                                        {
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                                // only add div-tags to the previous elements if they contain usable data - in example
                                // of a p-element
                                if (!found) // remove the div-tag which contains only useless data
                                {
                                    tagStack.pop();
                                }
                            }
                        }
                        else
                        {
                            // as the end of of sub element was reached add it to the parent element
                            for (Token t : tagStack.pop())
                            {
                                if (tagStack.isEmpty())
                                {
                                    tagStack.push(new ArrayList<>());
                                }
                                tagStack.peek().add(t);
                            }
                        }
                    }
                }
            }
            else
            {
                if (!tagStack.isEmpty() && tagStack.get(0) != null)
                {
                    tagStack.peek().add(token);
                }
                else
                {
                    List<Token> element = new ArrayList<>();
                    element.add(token);
                    tagStack.push(element);
                }
            }
        }

        Predicate<Token> filterUnwantedTags = t ->
                !t.getHTML().startsWith("<div") && !t.getHTML().startsWith("</div") &&
                !t.getHTML().startsWith("<unknown") && !t.getHTML().startsWith("</unknown");

        // ignore output of div- and unknown-tags
        return tagStack.stream().flatMap(List::stream).filter(filterUnwantedTags).collect(Collectors.toList());
    }

    private static void removeOrAppendToParentTag(Stack<List<Token>> tagStack, boolean remove)
    {
        if (remove)
        {
            tagStack.pop();
        }
        else
        // if not, append the li-tag to its parent tag
        {
            for (Token t : tagStack.pop())
            {
                if (tagStack.isEmpty())
                {
                    tagStack.push(new ArrayList<>());
                }
                tagStack.peek().add(t);
            }
        }
    }

    /**
     * Formats the text in a more human readable form.
     *
     * @param text
     *         The {@link List} of {@link Token}s which should be formatted
     *
     * @return The formatted text
     */
    public static String formatText(List<Token> text)
    {
        StringBuilder builder = new StringBuilder();
        builder.append("\n");
        boolean blank = false;
        boolean append = true;
        boolean newLine = true;
        Token lastToken = null;
        for (Token t : text)
        {
            // if the last token was a word and this token is a word add a blank before the new token: 'word1 word2'
            if (blank && append && t instanceof Word && !newLine)
            {
                builder.append(" ");
            }
            // if the last token was a tag and it was a closing tag and the new token is a word add a blank: '</a> text'
            // only if the new word is neither a . or :
            if ((append && lastToken instanceof Tag && !((Tag) lastToken).isOpeningTag()) && t instanceof Word &&
                !t.getText().equals(":") && !t.getText().equals(".") && !newLine)
            {
                builder.append(" ");
            }
            // create a blank before a link if the last token was a word: 'word <a href...>'
            if (append && t instanceof Tag && lastToken instanceof Word && ((Tag) t).isOpeningTag() &&
                ((Tag) t).getShortTag().equals("a") && !newLine)
            {
                builder.append(" ");
            }

            if (t instanceof Tag)
            {
                blank = false;
                Tag tag = (Tag) t;
                // if the text contains <article>...</article> segments only use the part between those tags as content
                if (tag.getShortTag().equals("article") || tag.getShortTag().equals("more"))
                {
                    append = tag.isOpeningTag();
                }
                // don't show special HTML tags
                if (append && !tag.getShortTag().equals("p") && !tag.getShortTag().equals("cite") &&
                    !tag.getShortTag().equals("li") &&
                    !tag.getShortTag().equals("strong") && !tag.getShortTag().equals("i") &&
                    !tag.getShortTag().equals("b") &&
                    !tag.getShortTag().equals("ul") && !tag.getShortTag().equals("span") &&
                    !tag.getShortTag().matches("h[1-6]") &&
                    !tag.getShortTag().equals("article") && !tag.getShortTag().equals("abbr") &&
                    !tag.getShortTag().equals("em") && !tag.getShortTag().equals("figure") &&
                    !tag.getShortTag().equals("figcaption"))
                {
                    builder.append(t.getHTML());
                    newLine = false;
                }
                // insert a new line segment for certain HTML tags
                if (!tag.isOpeningTag() && append && (tag.getShortTag().equals("p") || tag.getShortTag().matches("h1")))
                {
                    builder.append("\n\n");
                    newLine = true;
                }
                if (!tag.isOpeningTag() && (tag.getShortTag().matches("h[2-6]") || tag.getShortTag().equals("li") ||
                                            tag.getShortTag().equals("cite")))
                {
                    builder.append("\n");
                    newLine = true;
                }
                // insert a blank after a span-tag
                if (!tag.isOpeningTag() && append && (tag.getShortTag().equals("span")) && builder.capacity() > 0 &&
                    !newLine)
                {
                    builder.append(" ");
                }
            }
            else
            {
                if (append)
                {
                    if (!t.getText().trim().equals(""))
                    {
                        builder.append(t.getText());
                        newLine = false;
                        blank = true;
                    }
                }
            }
            lastToken = t;
        }

        // TODO: Replace with existing conversion method/library
        // replace special character encodings
        String txt = builder.toString();
        txt = txt.replaceAll("’", "'");
        txt = txt.replaceAll("–", "-");
        txt = txt.replaceAll("—", "-");
        txt = txt.replaceAll("‘", "'");
        txt = txt.replaceAll("’", "'");
        txt = txt.replaceAll(" ", " ");
        txt = txt.replaceAll("“", "\"");
        txt = txt.replaceAll("”", "\"");
        txt = txt.replaceAll("£", "L");

        txt = txt.replaceAll("â€“", "-");
        txt = txt.replaceAll("â€œ", "\"");
        txt = txt.replaceAll("â€", "\"");

        txt = txt.replaceAll("&quot;", "\"");
        txt = txt.replaceAll("&amp;", "&");
        txt = txt.replaceAll("&nbsp;", " ");
        txt = txt.replaceAll("&rsquo;", "'");
        txt = txt.replaceAll("&mdash;", "-");
        txt = txt.replaceAll("&ldquo;", "\"");
        txt = txt.replaceAll("&rdquo;", "\"");

        txt = txt.replaceAll("&#32;", " ");
        txt = txt.replaceAll("&#39;", "'");
        txt = txt.replaceAll("&#160;", " ");

        txt = txt.replaceAll("&#039;", "'");
        txt = txt.replaceAll("&#8217;", "'");
        txt = txt.replaceAll("&#8220;", "\"");
        txt = txt.replaceAll("&#8221;", "\"");

        txt = txt.replace("+ -", "+/-");

        // remove links and only present text
        txt = txt.replaceAll("<a .*?>(.*?)</a>", "$1");
        txt = txt.replaceAll("</a>", "");
        txt = txt.replaceAll("<a .*?>", "");

        txt = txt.replace("<hr>", "");

        // sometimes div-tags seem to be cut off inappropriately - delete their
        // garbage
        txt = txt.replaceAll("id=.*?>", "");
        txt = txt.replaceAll("class=.*?>", "");
        return txt.trim();
    }
}
