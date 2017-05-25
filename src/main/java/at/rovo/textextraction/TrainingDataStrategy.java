package at.rovo.textextraction;

import at.rovo.classifier.Classifier;

/**
 * This interface defines methods a concrete algorithm, which loads data from some source and trains a classifier, needs
 * to implement.
 */
public interface TrainingDataStrategy
{
    /**
     * Trains a classifier with data loaded according to the implementation of the concrete strategy.
     *
     * @param classifier
     *         The classifier to train
     * @param retrain
     *         Optional parameter that specifies to retrain the classifier even if a trained model from a previous
     *         invocation was found
     *
     * @return The trained classifier
     */
    Classifier<String, String> trainModel(Classifier<String, String> classifier, boolean... retrain);
}
