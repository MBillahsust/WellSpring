const Assessment = require("../model/models").Assessment;  // adjust path and model name as needed

// Remove all null bytes from a string
const removeNullBytes = (str) => {
  if (typeof str !== "string") return str;
  return str.replace(/\0/g, "");
};

const store = async (req, res) => {
  try {
    const userId = req.userId;
    let {
      assessmentName,
      assessmentResult,
      assessmentScore,
      recommendation,
      takenAt
    } = req.body;

    if (!assessmentName || !assessmentResult || !assessmentScore || !recommendation || !takenAt) {
      return res.status(400).json({ error: "All fields are required" });
    }

    assessmentName = removeNullBytes(assessmentName);
    assessmentResult = removeNullBytes(assessmentResult);
    assessmentScore = removeNullBytes(assessmentScore);
    recommendation = removeNullBytes(recommendation);
    takenAt = removeNullBytes(takenAt);

    if (isNaN(Date.parse(takenAt))) {
      return res.status(400).json({ error: "takenAt must be a valid date string" });
    }

    const newAssessment = new Assessment({
      userId,
      assessmentName,
      assessmentResult,
      assessmentScore,
      recommendation,
      takenAt: new Date(takenAt)
    });

    await newAssessment.save();

    res.status(201).json({ message: "Assessment saved successfully", assessment: newAssessment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const remove = async (req, res) => {
  try {
    const userId = req.userId;
    const assessmentId = req.params.id;

    if (!assessmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid assessment id" });
    }

    const existingAssessment = await Assessment.findById(assessmentId);

    if (!existingAssessment || existingAssessment.userId.toString() !== userId) {
      return res.status(404).json({ error: "Assessment not found or access denied" });
    }

    await Assessment.findByIdAndDelete(assessmentId);

    res.status(200).json({ message: "Assessment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAssessments = async (req, res) => {
  try {
    const userId = req.userId;

    const assessments = await Assessment.find({ userId })
      .sort({ _id: -1 }); // latest first

    res.status(200).json({ assessments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { store, remove, getAssessments };
