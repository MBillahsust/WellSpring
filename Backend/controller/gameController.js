const GameScore = require("../model/models").GameScore;
const GameAssessment = require("../model/models").GameAssessment;



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
        highestAvgScore: lastAvg
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

    // Prompt Template for AI-generated cognitive traits:
    /*
    Prompt Template:

    Generate a cognitive performance report for a player based on the following inputs:

    * Current Average Score: [CURRENT_SCORE]
    * Previous Average Score: [PREVIOUS_SCORE]
    * Top Game Average Score: [TOP_SCORE]

    The report should include these sections as a JSON object:

    1. "recommendation" — based on the comparison of scores and general cognitive traits like attention, memory, reaction time, coordination, and stress response
    2. "trait_scores" — a set of numeric values (scale 1–100) for:

    * attention
    * focus
    * short_term_memory
    * reaction_time
    * working_memory
    * hand_eye_coordination
    * stress_response
    */

    // Static example values for now; replace with AI response later
    const recommendation = "Your performance is improving. To reach top-level scores, focus on sharpening your reaction time and hand-eye coordination. Take short, focused sessions and manage stress through breaks or calming techniques to maintain mental sharpness.";

    const traitScores = {
      attention: 78,
      focus: 75,
      short_term_memory: 72,
      reaction_time: 68,
      working_memory: 74,
      hand_eye_coordination: 70,
      stress_response: 65
    };

    res.json({
      gameScore: existing,
      cognitive_report: {
        recommendation,
        trait_scores: traitScores
      },
      meta: {
        current_average_score: lastAvg,
        previous_average_score: previousAvgScore,
        top_game_average_score: topScore,
        user_highest_average_score: existing.highestAvgScore,
        rank: rank || "Last"
      }
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
