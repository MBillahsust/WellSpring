const { ResearchQuestionnaire } = require("../model/models");

const submitResearch = async (req, res) => {
  try {
    // Destructure expected fields
    const { email, gender, age, ...answers } = req.body;

    // Validate required gender and age
    if (typeof gender !== "string" || gender.trim() === "") {
      return res
        .status(400)
        .json({ error: "Gender is required and must be a non-empty string" });
    }
    if (typeof age !== "string" || age.trim() === "") {
      return res
        .status(400)
        .json({ error: "Age is required and must be a non-empty string" });
    }

    // Validate that all 55 questions are present and are numbers
    for (let i = 1; i <= 55; i++) {
      const key = `Q${i}`;
      if (!(key in answers) || typeof answers[key] !== "number") {
        return res
          .status(400)
          .json({ error: `Question ${i} is required and must be a number` });
      }
    }

    // Build the document payload
    const payload = {
      gender,
      age,
      ...answers,
      // only include email if provided
      ...(email != null && { email }),
    };

    // Save to database
    const questionnaire = new ResearchQuestionnaire(payload);
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
