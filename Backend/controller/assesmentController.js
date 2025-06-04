const prisma = require("../db");

// Store a new assessment
const store = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      assessmentName,
      assessmentResult,
      assessmentScore,
      assessmentRecommendation,
      takenAt
    } = req.body;

    if (!assessmentName || !assessmentResult || !assessmentScore || !assessmentRecommendation || !takenAt) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAssessment = await prisma.assessments.create({
      data: {
        userId,
        assessmentName,
        assessmentResult,
        assessmentScore,
        assessmentRecommendation,
        takenAt: new Date(takenAt)
      }
    });

    res.status(201).json({ message: "Assessment saved successfully", assessment: newAssessment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete an assessment by ID
const remove = async (req, res) => {
  try {
    const userId = req.userId;
    const assessmentId = parseInt(req.params.id);

    const existingAssessment = await prisma.assessments.findUnique({
      where: { id: assessmentId }
    });

    if (!existingAssessment || existingAssessment.userId !== userId) {
      return res.status(404).json({ error: "Assessment not found or access denied" });
    }

    await prisma.assessments.delete({
      where: { id: assessmentId }
    });

    res.status(200).json({ message: "Assessment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { store, remove };
