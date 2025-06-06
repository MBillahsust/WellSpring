const prisma = require("../db");

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

    // Optional: further validation for takenAt (e.g., valid ISO date string)
    if (isNaN(Date.parse(takenAt))) {
      return res.status(400).json({ error: "takenAt must be a valid date string" });
    }

    const newAssessment = await prisma.assessments.create({
      data: {
        userId,
        assessmentName,
        assessmentResult,
        assessmentScore,
        recommendation,
        takenAt
      }
    });

    res.status(201).json({ message: "Assessment saved successfully", assessment: newAssessment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






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


// Get all assessments for the logged-in user
const getAssessments = async (req, res) => {
  try {
    const userId = req.userId;

    const assessments = await prisma.assessments.findMany({
      where: { userId },
      orderBy: { id: "desc" } // optional: latest first
    });

    res.status(200).json({ assessments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { store, remove, getAssessments };
