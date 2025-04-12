const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const submitResearch = async (req, res) => {
  try {
    const { email, ...answers } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate that all 55 questions are provided and are integers
    for (let i = 1; i <= 55; i++) {
      const questionKey = `Q${i}`;
      if (!(questionKey in answers) || typeof answers[questionKey] !== 'number') {
        return res.status(400).json({ error: `Question ${i} is required and must be a number` });
      }
    }

    // Create new research questionnaire entry
    const questionnaire = await prisma.researchQuestionnaire.create({
      data: {
        email,
        ...answers
      }
    });

    res.status(201).json({
      message: 'Research questionnaire submitted successfully',
      data: questionnaire
    });
  } catch (error) {
    console.error('Error submitting research questionnaire:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A questionnaire with this email already exists' });
    }
    res.status(500).json({ 
      error: 'Failed to submit research questionnaire',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
};



module.exports = { submitResearch }; 