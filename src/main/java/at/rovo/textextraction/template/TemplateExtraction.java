package at.rovo.textextraction.template;

import java.util.Deque;
import java.util.LinkedList;
import at.rovo.parser.HTMLNode;
import at.rovo.parser.Parser;

/**
 * <p>Zhang and Lin have presented a novel approach on content extraction through
 * using two similar news pages as input set which are passed to the template 
 * generation algorithm <em>{@link #TG}</em>.</p>
 * <p>Based on the two similar pages the improved simple tree matching algorithm
 * <em>{@link #ISTM}</em> builds a maximum matching tree <em>tm</em>, which is 
 * done by comparing nodes in the two DOM-trees belonging to the two input 
 * parameters. The maximum matching tree is used by the template extraction 
 * algorithm <em>{@link #TE}</em> to build a template which is than used by the 
 * news content extraction algorithm <em>{@link #NCE}</em> to extract the 
 * article's main body.</p>
 * <p></p>
 * 
 * @author Roman Vottner
 */
public class TemplateExtraction
{
	private LinkedList<HTMLNode> matchedChildren = new LinkedList<HTMLNode>();
	/** The DOM-tree of the first input page **/
	private HTMLNode[] ta = null;
	/** The DOM-tree of the second input page **/
	private HTMLNode[] tb = null;
	/** Maximum matching tree**/
	private HTMLNode[] tm = null;
	/** Extraction template**/
	private Deque<HTMLNode> tt = new LinkedList<HTMLNode>();
	
	/**
	 * <p>Template generating algorithm.</p>
	 * <p>Takes the total content of two HTML pages as full String as input
	 * parameter and compares these two pages on node-level of their corresponding
	 * DOM-trees to extract a common template for the first input page.</p>
	 * 
	 * @param url1 The first page
	 * @param url2 The second page which should be very similar to the first 
	 *             page (e.g. taken from the same source)
	 * @return The extraction template <em>tt</em>, which can be used be the
	 *         news content extraction ({@link NCE}) algorithm
	 */
	public Deque<HTMLNode> TG(String url1, String url2)
	{
		this.ta = this.buildDOMTree(url1);
		System.out.println("URL1 contains "+ta.length+" nodes");
		this.tb = this.buildDOMTree(url2);
		System.out.println("URL2 contains "+tb.length+" nodes");
		this.tm = new HTMLNode[this.ta.length];
		
		// Simple tree matching and backtracking (STMB) algorithm based on 
		// simple tree matching (STM) and longest common subsequence (LCS)
		
		// improved simple tree matching algorithm
		this.ISTM(0, 0);
		System.out.println("comparedNodes and matrixes calculated");
		// simple tree matching and backtracking algorithm
		this.tm = this.MMTB(0);
		System.out.println("calculating backtracking");
		
		// template extraction algorithm
		this.TE(0);
		System.out.println("generated extraction template");
		return this.tt;
	}
	
	/**
	 * <p>Improved simple tree matching algorithm.</p>
	 * <p>Initializes the <em>matchedMatrix</em>-, <em>comparedNode</em>- and 
	 * <em>comparedMatrix</em>-fields of nodes in the DOM-tree of ta.</p>
	 * <p>It first compares a node taken from both trees for equal names and if
	 * there names do not match their subtree do not match either. But if they 
	 * match the algorithm recursively finds the maximum matching between the
	 * subtrees rooted by the children of ta[p] and tb[q].</p>
	 * <p>Therefore it initializes two matrixes: m and f. The primer is the 
	 * maximum matched nodes matrix while the latter is the maximum matched path 
	 * matrix.</p>
	 * <p>As f is not always the true <em>matchedMatrix</em> because ta[p] may 
	 * match multiple nodes in tb, it is only treated as the initial value
	 * of matchedMatrix.</p>
	 * <p>ta[p]'s <em>comparedNode</em> set will store all tb's nodes which have 
	 * been compared with ta[p], while ta[p]'s <em>comparedMatrix</em> stores the 
	 * related matching path flag matrix <em>f</em> in order to find the true 
	 * matched Matrix of ta[p] in the sequent algorithms.</p>
	 * 
	 * @param p The index of the p-th element of the DOM-tree ta 
	 * @param q The index of the q-th element of the DOM-tree tb
	 * @return
	 */
	private int ISTM(int p, int q)
	{
		this.ta[p].addComparedNodes(this.tb[q]);
		// compare names, if they are distinct, the subtree rooted by them do 
		// not match at all
		if (!this.ta[p].getName().equals(this.tb[q].getName()))
		{
			this.ta[p].addComparedMatrixes(null);
			return 0;
		}
		// if they match however, the algorithm recursively finds the maximum 
		// matching between the subtrees rooted by the children ta[p] and tb[q]
		else
		{
			int k = this.ta[p].getChildren().length;
			int n = this.tb[q].getChildren().length;
			int[][] m = new int[k+1][n+1]; // maximum matched nodes matrix
			int[][] f = new int[k+1][n+1]; // maximum matched path matrix
			for (int i=0; i<=k; i++)
			{
				m[i][0] = 0;
				f[i][0] = 0;
			}
			for (int j=1; j<=n; j++)
			{
				m[0][j] = 0;
				f[0][j] = 0;
			}
			for (int i=1; i<=k; i++)
			{
				int _p = this.ta[p].getChildren()[i-1].getNo();
				for (int j=1; j<=n; j++)
				{
					// the next index of the child
					int _q = this.tb[q].getChildren()[j-1].getNo();
					// recursively seek the maximum match in the child's context
					int w = this.ISTM(_p, _q);
					// application of the maximum matching node
					m[i][j] = Math.max(m[i][j-1], Math.max(m[i-1][j], m[i-1][j-1]+w));
					// set the path according to the maximum matching node
					if (m[i][j] == m[i-1][j-1]+w && w > 0)
					{
						f[i][j] = MatchedMatrixValue.UP_LEFT.getValue();
					}
					else if (m[i][j] == m[i-1][j])
					{
						f[i][j] = MatchedMatrixValue.UP.getValue();
					}
					else if (m[i][j] == m[i][j-1])
					{
						f[i][j] = MatchedMatrixValue.LEFT.getValue();
					}
				}
			}
			
			// set matched tree path matrixes
			this.ta[p].setMatchedMatrix(f);
			this.ta[p].addComparedMatrixes(f);
			
			return m[k][n]+1;
		}
	}
	
	/**
	 * <p>Maximum matching tree backtracking algorithm</p>
	 * <p>As the improved simple matching tree ({@link #ISTM}) algorithm does not
	 * provide any backtracking information, this algorithm uses the matched
	 * children backtracking algorithm ({@link #MCB}) to get its matched children
	 * furtherly.</p>
	 * 
	 * @param p The index of the p-th element of the DOM-tree ta
	 */
	private HTMLNode[] MMTB(int p)
	{
		// safe copy to prevent changes made to children in tm affect children in ta
		this.tm[p] = new HTMLNode(this.ta[p]);
		this.tm[p].setChildren(new LinkedList<HTMLNode>());
		int f[][] = this.ta[p].getMatchedMatrix();
		if (f != null)
		{
			int i = f.length-1;
			int j = f[0].length-1;
			// matchedChildren <-- MCB(ta[p], f, i, j) is set inside of MCB
			this.MCB(p, f, i, j);
			while (this.matchedChildren != null && !this.matchedChildren.isEmpty())
			{
				p = this.matchedChildren.poll().getNo();
				// Delete matchedChildren.firstElement ... is achieved in previous poll
				this.MMTB(p);
			}
		}	
		return tm;
	}
	
	/**
	 * <p>Matched children backtracking algorithm</p>
	 * <p>Besides finding the matched children using ta's <em>matchedMatrix</em>
	 * field, the main job is to modify the initial <em>matchedMatrix</em> of 
	 * each matched child.</p>
	 * 
	 * @param p The index of the p-th element of the DOM-tree ta
	 * @param matchedMatrix The matched tree path matrix of ta for node p
	 * @param i The x-position in the matchedMatrix to look for the value
	 * @param j The y-position in the matchedMatrix to look for the value
	 */
	private void MCB(int p, int[][] matchedMatrix, int i, int j)
	{
		// slight modification as if the 1st page is larger than the second or a 
		// segment of the 1st page contains more children than the 2nd page,
		// j might become negative while i is 0. 
		// To my understanding if either of i or j gets 0 the border of the
		// matrix was reached.
		if (i==0 || j==0)	
			return ;
		if (matchedMatrix[i][j] == MatchedMatrixValue.UP_LEFT.getValue())
		{
 			this.MCB(p, matchedMatrix, i-1, j-1);
			// contains elements from 1st page
//			HTMLNode child = new HTMLNode(this.ta[p].getChildren()[i-1]); // by Val
			HTMLNode child = this.ta[p].getChildren()[i-1];               // by Ref
			// contains elements from 2nd page
//			HTMLNode comparedNode = new HTMLNode(this.tb[child.getComparedNodes().peek().getParentNo()]);
			HTMLNode comparedNode = this.tb[child.getComparedNodes().peek().getParentNo()];
			
			while (this.ta[p].getMatchedNode() != comparedNode)
			{
				int k = comparedNode.getChildren().length; 
				int n = this.ta[p].getChildren().length;
				
				for (int _i=0; _i < k-1; _i++)
					// Delete child.comparedNodes.firstElement
					child.getComparedNodes().poll();
				for (int h=0; h < n-1; h++)
				{
					this.ta[p].getChildren()[h].setComparedNodes(child.getComparedNodes());
					for (int _i=0; _i < k-1; _i++)
						// Delete ta[p].children[h].comparedMatrix.firstElement
						this.ta[p].getChildren()[h].getComparedMatrix().poll();
				}
				if (child.getComparedNodes().size() > 0)
					comparedNode = this.tb[child.getComparedNodes().peek().getParentNo()];
				else
					break;
			}
//			child.setMatchedNode(child.getComparedNodes().get(j-1));
//			child.setMatchedNode(new HTMLNode(comparedNode.getChildren()[j-1]));
			child.setMatchedNode(comparedNode.getChildren()[j-1]);
			child.setMatchedMatrix(null);
			if (child.getComparedMatrix().size() > 0)
			{
				child.setMatchedMatrix(child.getComparedMatrix().get(j-1));
			}
			// Add child to matchedChildren, tm[p].children
//			matchedChildren.add(new HTMLNode(child));
			this.matchedChildren.add(child);
//			this.tm[p].addChild(new HTMLNode(child));
			this.tm[p].addChild(child);
		}
		else if (matchedMatrix[i][j] == MatchedMatrixValue.UP.getValue())
			this.MCB(p, matchedMatrix, i-1, j);
		else
			this.MCB(p, matchedMatrix, i, j-1);
	}
	
	/**
	 * <p>Text extraction algorithm</p>
	 * <p>Generates an extraction template <em>tt</em>, which is the set of 
	 * non-noisy nodes by depth-first traversal of the maximum matching tree
	 * <em>tm</em> which only contains nodes that matched in both ta and tb 
	 * trees.</p>
	 * <p>If two pages have the same sub-trees, these fractions are considered
	 * noise. As anchor-tags are hidden noise text, the anchor-text-ratio of a
	 * sub-segment has to exceed a given threshold to be excluded.</p>
	 * <p>Moreover punctuation metric's are used to further separate noise from
	 * content.</p>
	 * 
	 * @param i The index of the i-th element of the maximum matching tree tm
	 */
	private Deque<HTMLNode> TE(int i)
	{
		HTMLNode matchedNode = new HTMLNode(this.tm[i].getMatchedNode());
		if (this.tm != null && !this.tm[i].getSubtreeText().equals(matchedNode.getSubtreeText()) 
			&& this.tm[i].getAnchorTextRatio()<=1.3 * this.ta[0].getAnchorTextRatio()
				&& !(this.tm[i].getPunctNum() == 0 && this.tm[i].getSegNum() >= 3))
		{
			if (this.tm[i].getSibNo() == matchedNode.getSibNo())
			{
				this.tt.add(this.tm[i]);
				for (int j=1; j<this.tm[i].getChildren().length; j++)
				{
					this.TE(this.tm[i].getChildren()[j].getNo());
				}
			}
			// expand extraction range of tt to extract content that did not 
			// matched in the maximum matching tree tm as they occurred in tb
			// but not in ta
			else if (this.tm[this.tm[i].getParentNo()].getSibNo() == this.tb[matchedNode.getParentNo()].getSibNo())
			{
				while (this.tt.peekLast().getNo() != this.tm[i].getParentNo())
					this.tt.removeLast();
			}
		}
		return this.tt;
	}
	
	/**
	 * <p>News content extraction algorithm</p>
	 * <p>Uses the extraction template generated by the template generation 
	 * process ({@link #TG}) and utilizes some own characteristics of the target
	 * page pt to extract the content of it which first needs to be parsed to a
	 * DOM tree tp.</p>
	 * 
	 * @param tt
	 * @param tp_i
	 */
	public void NCE(Deque<HTMLNode> tt, HTMLNode tp_i)
	{
		// templateNode <-- tt.firstElement
		HTMLNode templateNode = tt.getFirst();
		if (templateNode.getName().equals(tp_i.getName()) &&
				templateNode.getLevel() == tp_i.getLevel() &&
				templateNode.getSibNo() == tp_i.getSibNo())
		{
			tt.removeFirst();
			if (tt.size() > 0)
			{
				HTMLNode nextTemplateNode = tt.getFirst();
				if (tp_i.getChildren() == null || tp_i.getChildren().length == 0)
				{
					System.out.println(tp_i.getText());
					while (nextTemplateNode.getParentNo() == templateNode.getNo())
					{
						tt.removeFirst();
						templateNode = nextTemplateNode;
						nextTemplateNode = tt.getFirst();
					}
				}
				else
				{
					if (nextTemplateNode.getParentNo()!=templateNode.getNo())
					{
						System.out.println(this.deleteEmbededNoise(tp_i.getSubtreeText()));
					}
					for (int j=0; j<tp_i.getChildren().length; j++)
					{
						this.NCE(tt, tp_i.getChildren()[j]);
					}
				}
			}
			else
			{
				System.out.println(this.deleteEmbededNoise(tp_i.getSubtreeText()));
			}
		}
	}
	
	private String deleteEmbededNoise(String subtreeText)
	{
		return subtreeText;
	}
	
	public HTMLNode[] buildDOMTree(String url)
	{
		// remove invalid HTML tags including <#comment>, <style>, <script>, 
		// <noscript>, <img>, <form>, <input> and <select>
		
		return Parser.getDOMTree(url);
	}
	
	public static void main(String[] args)
	{
//		String url1 = "<html><head><title>Testpage 1</title></head><body><p>This is an example text.</p></html>";
//		String url2 = "<html><head><title>Testpage 2</title></head><body><p>This is a further example text.</p><p>It even contains a sentence more.</p></html>";
//		String url1 = "<html><head><title>Testpage 1</title></head><body><p>This is an example text, that contains a <a>link</a> which points to nowhere.</p></html>";
//		String url2 = "<html><head><title>Testpage 2</title></head><body><p>This is a further example text.</p><ul><li>with a intermediary listing</li><li>That contains a <a>link</a> too</li></ul><p>It even contains a sentence more.</p></html>";
		String url1 = "http://www.washingtonpost.com/business/economy/romney-chose-paul-ryan-to-shift-the-campaign-debate-will-the-gamble-pay-off/2012/08/13/f9ae54e2-e557-11e1-9739-eef99c5fb285_story.html";
		String url2 = "http://www.washingtonpost.com/business/economy/obamas-record-on-outsourcing-draws-criticism-from-the-left/2012/07/09/gJQAljJCZW_story.html";
		TemplateExtraction te = new TemplateExtraction();
		Deque<HTMLNode> template = te.TG(url1, url2);
		te.NCE(template, te.buildDOMTree(url2)[0]);
	}
}
