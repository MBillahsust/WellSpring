const GameScore = require("../model/models").GameScore;
const GameAssessment = require("../model/models").GameAssessment;


const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



function isValidReport(report) {
  // Check if report has recommendation string and trait_scores object with all required keys as numbers
  if (
    typeof report !== "object" ||
    typeof report.recommendation !== "string" ||
    typeof report.trait_scores !== "object"
  ) {
    return false;
  }
  const traits = [
    "attention",
    "focus",
    "short_term_memory",
    "reaction_time",
    "working_memory",
    "hand_eye_coordination",
    "stress_response",
  ];
  for (const trait of traits) {
    if (
      typeof report.trait_scores[trait] !== "number" ||
      report.trait_scores[trait] < 0 ||
      report.trait_scores[trait] > 100
    ) {
      return false;
    }
  }
  return true;
}

async function getAIReport(aiPrompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const aiResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", // adjust model as per access
        messages: [
          { role: "system", content: "You are a data analysis agent. Respond ONLY with a JSON object following the structure described." },
          { role: "user", content: aiPrompt },
        ],
        response_format: { type: "json_object" },
      });

      const report = aiResponse.choices[0].message.content;

      // In case Groq returns JSON string or object, handle both
      let parsedReport;
      if (typeof report === "string") {
        parsedReport = JSON.parse(report);
      } else {
        parsedReport = report;
      }

      if (isValidReport(parsedReport)) {
        return parsedReport;
      } else {
        console.warn(`AI report format invalid on attempt ${attempt}, retrying...`);
      }
    } catch (err) {
      console.error(`Error fetching AI report on attempt ${attempt}:`, err);
    }
  }
  throw new Error("Failed to get a valid AI report after max retries.");
}


const updateAndGetGameScores = async (req, res) => {
  try {
    const userId = req.userId;
    const { game_name, game1Score, game2Score, game3Score } = req.body;

    if (!game_name || game1Score == null || game2Score == null || game3Score == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const lastAvg = Math.round((game1Score + game2Score + game3Score) / 3);
    let existing = await GameScore.findOne({ userId, game_name });
    let previousAvgScore = 0;

    if (!existing) {
      const newEntry = new GameScore({
        userId,
        game_name,
        game1Score,
        game2Score,
        game3Score,
        LastAvgScore: lastAvg,
        highestAvgScore: lastAvg,
      });
      await newEntry.save();
      existing = newEntry;
    } else {
      previousAvgScore = existing.LastAvgScore;
      existing.game1Score = game1Score;
      existing.game2Score = game2Score;
      existing.game3Score = game3Score;
      existing.LastAvgScore = lastAvg;
      existing.highestAvgScore = Math.max(existing.highestAvgScore || 0, lastAvg);
      await existing.save();
    }

    const topScoreDoc = await GameScore.findOne({ game_name }).sort({ highestAvgScore: -1 });
    const topScore = topScoreDoc ? topScoreDoc.highestAvgScore : 0;

    const allScores = await GameScore.find({ game_name }).sort({ highestAvgScore: -1 });
    const rank = allScores.findIndex(score => score.userId.toString() === userId.toString()) + 1 || "Last";

    const aiPrompt = `
Generate a cognitive performance report for a player based on the following inputs:
Game name: ${game_name}
Current Average Score: ${lastAvg}
Previous Average Score: ${previousAvgScore}
User Highest Average Score: ${existing.highestAvgScore}
Top Game Average Score: ${topScore}
User rank: ${rank}

The report should include these sections as a JSON object:

1. "recommendation" — based on the comparison of scores and general cognitive traits like attention, memory, reaction time, coordination, and stress response
2. "trait_scores" — a set of numeric values (scale 1 - 100) for:
- attention
- focus
- short_term_memory
- reaction_time
- working_memory
- hand_eye_coordination
- stress_response

Ensure the values and message align with the player's performance (i.e., improvement, stagnation, or decline).
`;

    const cognitiveReport = await getAIReport(aiPrompt);

    res.json({
      gameScore: existing,
      cognitive_report: cognitiveReport,
      meta: {
        current_average_score: lastAvg,
        previous_average_score: previousAvgScore,
        top_game_average_score: topScore,
        user_highest_average_score: existing.highestAvgScore,
        rank: rank || "Last",
      },
    });
  } catch (error) {
    console.error("Error in updateAndGetGameScores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






// this api will be hitted - 1st
const getPlayerRank = async (req, res) => {
  try {
    const userId = req.userId;
    const gameName = req.params.game_name;

    if (!gameName) {
      return res.status(400).json({ error: "game_name is required as route parameter" });
    }

    const allScores = await GameScore.find({ game_name: gameName }).sort({ highestAvgScore: -1 });

    const userScore = await GameScore.findOne({ userId, game_name: gameName });

    if (!userScore) {
      return res.json({
        rank: "Last",
        totalPlayers: allScores.length,
        highestAvgScore: 0,
        message: "User has not played this game yet, ranked last."
      });
    }

    const rank = allScores.findIndex(score => score.userId.toString() === userId.toString()) + 1;

    res.json({
      rank,
      totalPlayers: allScores.length,
      highestAvgScore: userScore.highestAvgScore
    });
  } catch (error) {
    console.error("Error in getPlayerRank:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




const postGameAssessment = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      game_name,
      recommendation,
      attention,
      focus,
      short_term_memory,
      reaction_time,
      working_memory,
      hand_eye_coordination,
      stress_response,
      feedback
    } = req.body;

    if (
      !game_name ||
      !recommendation ||
      attention == null ||
      focus == null ||
      short_term_memory == null ||
      reaction_time == null ||
      working_memory == null ||
      hand_eye_coordination == null ||
      stress_response == null
    ) {
      return res.status(400).json({ error: "All fields except feedback are required" });
    }

    const newAssessment = new GameAssessment({
      userId,
      game_name,
      recommendation,
      attention,
      focus,
      short_term_memory,
      reaction_time,
      working_memory,
      hand_eye_coordination,
      stress_response,
      feedback: feedback || ""
    });

    await newAssessment.save();

    res.status(201).json({
      message: "Game assessment saved successfully",
      assessment: newAssessment
    });
  } catch (error) {
    console.error("Error in postGameAssessment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




const getAllGameAssessments = async (req, res) => {
  try {
    const userId = req.userId;

    const assessments = await GameAssessment.find({ userId });

    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ error: "No game assessments found for this user" });
    }

    res.json({ assessments });
  } catch (error) {
    console.error("Error in getAllGameAssessments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  getPlayerRank,
  updateAndGetGameScores,
  postGameAssessment,
  getAllGameAssessments
};
