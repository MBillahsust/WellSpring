const { ResearchQuestionnaire } = require("../model/models");

const submitResearch = async (req, res) => {
  try {
    const { email, ...answers } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate that all 55 questions are provided and are numbers
    for (let i = 1; i <= 55; i++) {
      const questionKey = `Q${i}`;
      if (!(questionKey in answers) || typeof answers[questionKey] !== "number") {
        return res
          .status(400)
          .json({ error: `Question ${i} is required and must be a number` });
      }
    }

    // Check if a questionnaire with the same email already exists
    const existing = await ResearchQuestionnaire.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "A questionnaire with this email already exists" });
    }

    // Create new research questionnaire entry
    const questionnaire = new ResearchQuestionnaire({
      email,
      ...answers,
    });

    await questionnaire.save();

    res.status(201).json({
      message: "Research questionnaire submitted successfully",
      data: questionnaire,
    });
  } catch (error) {
    console.error("Error submitting research questionnaire:", error);
    res.status(500).json({
      error: "Failed to submit research questionnaire",
      details: error.message,
    });
  }
};

module.exports = { submitResearch };
