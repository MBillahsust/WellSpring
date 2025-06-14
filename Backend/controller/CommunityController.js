const PlatformFeedback = require('../model/models').PlatformFeedback;

const submitPlatformFeedback = async (req, res) => {
  try {
        userId = req.userId;
    const {
      wasHelpful,
      likedFeatures,
      dislikedFeatures,
      suggestedImprovements,
      betterUnderstanding
    } = req.body;

    if (!userId || !wasHelpful || !likedFeatures || !dislikedFeatures || !suggestedImprovements || !betterUnderstanding) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const feedback = new PlatformFeedback({
      userId,
      wasHelpful,
      likedFeatures,
      dislikedFeatures,
      suggestedImprovements,
      betterUnderstanding
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback.' });
  }
};


const getAllPlatformFeedback = async (req, res) => {
  try {
    const feedbacks = await PlatformFeedback.find({}, {
      userId: 0, // Exclude userId
      __v: 0     // Optionally exclude __v as well
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error while fetching feedback.' });
  }
};



module.exports = { submitPlatformFeedback , getAllPlatformFeedback};
