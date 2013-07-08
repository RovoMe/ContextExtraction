
GENERAL INFO:
=============
Modern websites present content in various ways. Most websites nowadays use a 
form of content management system to publish new content and link to other 
articles and websites not only in a separated link section.

Content is therefore embedded in a specific design which is often in the middle 
of the screen surrounded by link-, related articles and comment-sections. Though 
plenty of other sections are possible too.

While focusing on online news articles, extracting the main article of the page 
is often quite easy to accomplish for humans. However trying to achieve the same 
result via employing a computer is not. A couple of research papers recently 
addressed this issue. F.e: 'Learning Block Importance Models for Web Pages' by 
Song, Liu, Wen and Ma as well as 'Extracting Article Text from the Web with 
Maximum Subsequence Segmentation' by Pasternack and Roth.

A DOM-based template producing content extraction algorithm (Zhang, Lin 2010) 
and a template independent method to extract content (Wu, Yang 2012) are 
currently experimentally added. Both algorithms do not extract content currently 
due to some unclear descriptions in their corresponding papers.

INSTALLATION & EXECUTION:
=========================
The project is set up as Apache Maven project. It is currently configured to 
execute automatically on installation via the pom.xml file. Therefore make sure 
you have downloaded the training database taken from the MSS creators 
(http://cogcomp.cs.illinois.edu/Data/MSS/) and put it in the 'trainingData' 
subdirectory of the project root.

On the first run, Maven will try to install all dependencies and then start the 
training of the naive Bayes classifier which is later used to get the 
probabilities of tokens (tags and words) to build a score which is used by the 
MSS algorithm to identify the main content of a page. Training can actually 
require more than an hour, depending on the sample size and the computer used. 
Note that training of 12 times 15000 examples for Bigrams may require up to 8 
Gigabyte of RAM, training on Trigram-features will require even more as much 
more trigrams will be found than Bigrams. So training 12 times 10000 samples 
will require more than 8 Gigabyte of RAM. 

Training will be done on 12 predefined "online news paper providers" which are 
already available in the 'ate.db' SQLite-Database. 

If training was executed successfully, the Java object that contains the 
training data will be persisted to disk into the 'trainingData' subdirectory to 
prevent re-training on multiple executions. Moreover a 'commonTags.ser' file 
will be created that contains the common tags used by various pages. 

Note however that the persisted training object is specific to the selected 
feature-type (Bigram, Trigram, ...) and the number of samples used for training.
On changing one of these parameters in the pom.xml file, the training process is
invoked again.

ToDo:
=====
*) Improve Naive Bayes storage (current approach is using to Hashtables inside 
   one Object that gets persisted - with large training data however this 
   requires like 8-9 gigabyte of RAM for training and runtime!)
*) Currently Bigram achieve best results, though the paper states that with less
   Trigram training more accurate results should be achievable
*) Fix Template-based algorithm. ISTM seems to work properly, MMTB should be 
   fine to. MCB and TE are the algorithms that needs to be corrected
*) TemplateIndependent algorithm: Unclear what exactly should happen at what 
   point in time. Moreover, not sure if an external stopword list should be used
   or the maximum likelihood estimator (MLE) directly take the words of the 
   segments. 