package at.rovo.parser;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class HTMLNode
{
	/** The order number that the node ranks in the DOM tree **/
	private int no = 0;
	/** The node's name, f.e. the element node's name is the HTML tag name in 
	 * the page **/
	private String name = null;
	/** The node's text value, which is null if the node isn't a leaf **/
	private String text = null;
	/** The full HTML tag **/
	private String html = null;
	/** The level of node in the DOM tree**/
	private int level = 0;
	/** no of the node's parent **/
	private int parentNo = 0;
	/** The number that the node ranks in its siblings **/
	private int sibNo = 0;
	/** The set of node's children **/
	private List<HTMLNode> children = new ArrayList<HTMLNode>();
	/** The text value of the subtree rooted by the node **/
	private String subtreeText = null;
	/** The ratio that the anchor text is included in subtreeText **/
	private double anchorTextRatio = -1.;
	/** The amount of common, semicolon and full stop in subtreeText **/
	private int punctNum = -1;
	/** The amount of segments that subtreeText is split by white space **/
	private int segNum = -1;
	/** The current node's matched node in the other DOM tree **/
	private HTMLNode matchedNode = null;
	/** The matrix to store the matching path flags such as "UP", "LEFT" and 
	 * "UP_LEFT" between the node's children and the matchedNode's children **/
	private int[][] matchedMatrix = null;
	/** The set of nodes in the other DOM tree which have compared with the 
	 * current node during the two DOM trees matching **/
	private LinkedList<HTMLNode> comparedNodes = new LinkedList<HTMLNode>();
	/** The set of matching path flag matrixes between the node's children and 
	 * comparedNode's children **/
	private LinkedList<int[][]> comparedMatrixes = new LinkedList<int[][]>();
		
	public HTMLNode(int no, String name, String text, int level, int parentNo, int sibNo)
	{
		this.no = no;
		this.name = name;
		this.text = text;
		this.level = level;
		this.parentNo = parentNo;
		this.sibNo = sibNo;
	}
	
	public HTMLNode(HTMLNode node)
	{
		if (node == null)
		{
			
		}
		else
		{
			// deep copy
			this.no = node.no;
			this.name = new String(node.name);
			if (node.text != null)
				this.text = new String(node.text);
			if (node.html != null)
				this.html = new String(node.html);
			this.level = node.level;
			this.parentNo = node.parentNo;
			this.sibNo = node.sibNo;
			this.children = new ArrayList<HTMLNode>(node.children);
			if (node.subtreeText != null)
				this.subtreeText = new String(node.subtreeText);
			this.anchorTextRatio = node.anchorTextRatio;
			this.punctNum = node.punctNum;
			this.segNum = node.segNum;
			if (node.matchedNode != null)
				this.matchedNode = new HTMLNode(node.matchedNode);
			if (node.matchedMatrix != null)
				this.matchedMatrix = node.matchedMatrix;
			if (node.comparedNodes != null)
				this.comparedNodes = new LinkedList<HTMLNode>(node.comparedNodes);
			if (node.comparedMatrixes != null)
				this.comparedMatrixes = new LinkedList<int[][]>(node.comparedMatrixes);
		}
	}
	
	public int getNo() { return this.no; }
	public String getName() { return this.name; }
	public void setName(String name) { this.name = name; }
	public String getText() { return this.text; }
	public void setText(String text) { this.text = text; }
	public String getHTML() { return this.html; }
	public void setHTML(String html) { this.html = html; }
	public int getLevel() {	return this.level; }
	public int getParentNo() { return this.parentNo; }
	public int getSibNo() {	return this.sibNo; }
	
	public HTMLNode[] getChildren()
	{
		if (this.children == null || this.children.size() == 0)
//			return null;
			return new HTMLNode[] {};
		
		LinkedList<HTMLNode> queue = new LinkedList<HTMLNode>();
		for (HTMLNode child : this.children)
			queue.add(child);
	
		List<HTMLNode> nodes = new ArrayList<HTMLNode>();
	    while(!queue.isEmpty())
	    {
	    	HTMLNode node = queue.remove();
	    	nodes.add(node);
//	    	if (node.getChildren() == null || node.getChildren().length == 0)
//	    		continue;
//	    	for (HTMLNode n : node.getChildren())
//	    	{
//	    		if (!nodes.contains(n))
//	    			nodes.add(n);
//	    		queue.add(n);
//	    	}
	    }
	    
//	    if (nodes.isEmpty())
//	    	return null;
	    
	    HTMLNode[] tmp = new HTMLNode[0];	    
		return nodes.toArray(tmp);
	}
	
	public void setChildren(List<HTMLNode> children)
	{
		this.children = children;
	}
	
	public void addChild(HTMLNode node)
	{
		if (!this.children.contains(node))
			this.children.add(node);
	}
	
	public void removeChild(HTMLNode node)
	{
		if (this.children.contains(node))
			this.children.remove(node);
	}
	
	public String getSubtreeText() 
	{ 
		if (this.subtreeText == null)
		{
			StringBuilder builder = new StringBuilder();
			
			for (HTMLNode child : this.children)
			{
				if (child.getText() != null && !child.getText().equals(""))
				{
					builder.append(child.getText().trim());
					builder.append(" ");
				}
				else
				{	
					String subTree = child.getSubtreeText().trim();
					if (!subTree.equals(""))
					{
						builder.append(subTree);
						builder.append(" ");
					}
				}
			}
			
			this.subtreeText = builder.toString().trim();
		}
		return this.subtreeText; 
	}
	
	public String getSubtreeAnchorText() 
	{ 
//		if (this.subtreeText == null)
//		{
			StringBuilder builder = new StringBuilder();
			
			for (HTMLNode child : this.children)
			{
				if (this.name.equals("<a>") && child.getText() != null && !child.getText().equals(""))
				{
					builder.append(child.getText().trim());
					builder.append(" ");
				}
				else
				{	
					String subTree = child.getSubtreeAnchorText().trim();
					if (!subTree.equals(""))
					{
						builder.append(subTree);
						builder.append(" ");
					}
				}
			}
			
			return builder.toString().trim();
//			this.subtreeText = builder.toString().trim();
//		}
//		return this.subtreeText; 
	}
	
	public double getAnchorTextRatio() 
	{
		if (anchorTextRatio == -1.)
		{
			String subTreeText = this.getSubtreeText();
			String subTreeAnchorText = this.getSubtreeAnchorText();
			
			this.anchorTextRatio = ((double)subTreeAnchorText.length() / subTreeText.length());
		}
		return this.anchorTextRatio; 
	}
	public int getPunctNum() 
	{
		if (this.punctNum == -1)
		{
			String subTreeText = this.getSubtreeText();
			this.punctNum = subTreeText.length() - subTreeText.replaceAll("[,|;|.]*", "").length();
		}
		return this.punctNum; 
	}
	
	public int getSegNum() 
	{
		if (this.segNum == -1)
		{
			this.segNum = this.getSubtreeText().split(" ").length;
		}
		return this.segNum; 
	}

	public HTMLNode getMatchedNode() { return this.matchedNode; }
	public void setMatchedNode(HTMLNode matchedNode) { this.matchedNode = matchedNode; }

	public int[][] getMatchedMatrix() { return this.matchedMatrix; }
	public void setMatchedMatrix(int m[][]) { this.matchedMatrix = m; }

	public LinkedList<int[][]> getComparedMatrix() { return this.comparedMatrixes; }
	public void addComparedMatrixes(int[][] matrix) { this.comparedMatrixes.add(matrix); }

	public LinkedList<HTMLNode> getComparedNodes() { return this.comparedNodes;	}
	public void addComparedNodes(HTMLNode node)
	{
		if (!this.comparedNodes.contains(node))
			this.comparedNodes.add(node);
	}
	public void setComparedNodes(LinkedList<HTMLNode> comparedNodes) { this.comparedNodes = comparedNodes; }
	
	@Override
	public String toString()
	{
		return this.no+" "+this.name+ (this.children == null || this.children.isEmpty() ? "" : " children: "+this.children);
	}
	
	@Override
	public int hashCode()
	{
		int result = 17;
		result = 31 * result + this.no;
		result = 31 * result + this.name.hashCode();
		result = 31 * result + this.text.hashCode();
		result = 31 * result + this.level;
		result = 31 * result + this.parentNo;
		result = 31 * result + this.sibNo;
		result = 31 * result + this.children.hashCode();
		return result;
	}
	
	@Override
	public boolean equals(Object obj)
	{
		HTMLNode node;
		if (obj instanceof HTMLNode)
			node = (HTMLNode) obj;
		else 
			return false;

		if (this.no != node.no)
			return false;
		if (!this.name.equalsIgnoreCase(node.name))
				return false;
		if ((this.text == null && node.text != null) || 
				(this.text != null && node.text == null) || 
				(this.text != null && node.text != null && !this.text.equalsIgnoreCase(node.text)))
			return false;
		if (this.level != node.level)
			return false;
		if (this.parentNo != node.parentNo)
			return false;
		if (this.sibNo != node.sibNo)
			return false;
		if (!this.children.equals(node.children))
			return false;

		return true;
	}
}
