const express = require('express');
const router = express.Router();
const { submitResearch, getResearchByEmail } = require('../controller/researchController');

// Submit research questionnaire
router.post('/research', submitResearch);

// Get research questionnaire by email
router.get('/research/:email', getResearchByEmail);

module.exports = router; 