package at.rovo.textextraction.mss;

/**
 * Defines the strategy used for training.
 * <p>
 * A UNIGRAM is a single word or tag, while a BIGRAM are two consecutive words or tags where the latter one is the key
 * token. Accordingly, a TRIGRAM consist of three consecutive tokens where, again, the last token is the key for this
 * N-Gram.
 * <p>
 * DOUBLE_UNIGRAM and TRIPLE_UNIGRAM are two or three consecutive tokens that are used independently for training and
 * therefore build a separate feature for the training instead of building one single feature as with the other
 * methods.
 *
 * @author Roman Vottner
 */
public enum TrainFeatureStrategy
{
    /** A single token **/
    UNIGRAM,
    /** Three consecutive tokens which are all used independently for training **/
    TRIPLE_UNIGRAM,
    /** Two consecutive tokens which are used as one feature for training **/
    BIGRAM,
    /** Two consecutive tokens which are all used independently for training **/
    DOUBLE_UNIGRAM,
    /** Three consecutive tokens which are used as one feature for training **/
    TRIGRAM
}
