const Assessment = require("../model/models").Assessment;
const MoodEntry = require("../model/models").MoodEntry;
const ActivityEntry = require("../model/models").ActivityEntry;
const GameScore = require("../model/models").GameScore;
const GameAssessment = require("../model/models").GameAssessment;

const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



const generateUserContext = async (userId, selectedAssessmentsId, moodHistory, activityHistory, gameHistory) => {
  // Fetch selected assessments
  const assessments = await Assessment.find({ _id: { $in: selectedAssessmentsId }, userId })
    .select("assessmentName assessmentResult assessmentScore recommendation takenAt")
    .sort({ takenAt: -1 });

        // Fetch latest moodHistory mood entries
    const moods = await MoodEntry.find({ userId })
      .select("mood notes time")
      .sort({ time: -1 }) // works if 'time' is ISO formatted
      .limit(moodHistory);

    // Fetch latest activityHistory activity entries
    const activities = await ActivityEntry.find({ userId })
      .select("activity notes time")
      .sort({ time: -1 }) // works if 'time' is ISO formatted
      .limit(activityHistory);

  
    

  // Fetch recent game scores limited by gameHistory
  const gameScores = await GameScore.find({ userId })
    .sort({ updatedAt: -1 })
    .limit(gameHistory);

  // Fetch matching game assessments for those game names
  const gameAssessments = await GameAssessment.find({
    userId,
    game_name: { $in: gameScores.map(gs => gs.game_name) }
  })
    .sort({ createdAt: -1 })
    .limit(gameHistory);

  // Build assessment summary string
  let assessmentSummary = "Recent Assessments:\n";
  if (!assessments.length) {
    assessmentSummary += "No recent assessment data available.\n";
  } else {
    assessments.forEach(a => {
      assessmentSummary += `- Name: ${a.assessmentName || "N/A"}, Result: ${a.assessmentResult || "N/A"}, Score: ${a.assessmentScore || "N/A"}, Recommendation: ${a.recommendation || "N/A"}\n`;
    });
  }

  // Build mood summary string
  let moodSummary = `Mood History (last ${moodHistory} days):\n`;
  if (!moods.length) {
    moodSummary += "No mood entries found.\n";
  } else {
    moods.forEach(m => {
      moodSummary += `- Mood: ${m.mood || "N/A"}, Notes: ${m.notes || "N/A"}, Date: ${m.time}\n`;
    });
  }

  // Build activity summary string
  let activitySummary = `Activity History (last ${activityHistory} days):\n`;
  if (!activities.length) {
    activitySummary += "No activity entries found.\n";
  } else {
    activities.forEach(a => {
      activitySummary += `- Activity: ${a.activity || "N/A"}, Notes: ${a.notes || "N/A"}, Date: ${a.time}\n`;
    });
  }

  // Build game data summary including feedback
  let gameSummary = `Recent Game Performance (last ${gameHistory} entries):\n`;
  if (!gameScores.length) {
    gameSummary += "No game performance data found.\n";
  } else {
    gameScores.forEach(gs => {
      const ga = gameAssessments.find(g => g.game_name === gs.game_name) || {};
      gameSummary += `- Game: ${gs.game_name}\n  Scores - Game1: ${gs.game1Score}, Game2: ${gs.game2Score}, Game3: ${gs.game3Score}\n  Avg Score: ${gs.LastAvgScore}, Highest Avg: ${gs.highestAvgScore}\n  Assessment - Attention: ${ga.attention || "N/A"}, Focus: ${ga.focus || "N/A"}, Short Term Memory: ${ga.short_term_memory || "N/A"}, Reaction Time: ${ga.reaction_time || "N/A"}, Working Memory: ${ga.working_memory || "N/A"}, Hand Eye Coordination: ${ga.hand_eye_coordination || "N/A"}, Stress Response: ${ga.stress_response || "N/A"}\n  Recommendation: ${ga.recommendation || "N/A"}\n  Feedback: ${ga.feedback || "N/A"}\n`;
    });
  }

  // Compose final context string (without system instructions)
  const context =
    assessmentSummary + "\n" +
    moodSummary + "\n" +
    activitySummary + "\n" +
    gameSummary;

  return context;
};








const getUserContextController = async (req, res) => {
  try {
    const userId = req.userId;  // assuming you get userId from auth middleware
    const { selectedAssessmentsId, moodHistory, activityHistory, gameHistory } = req.body;

    console.log(moodHistory, activityHistory);

    if (!Array.isArray(selectedAssessmentsId))
      return res.status(400).json({ error: "selectedAssessmentsId must be an array" });
    if (typeof moodHistory !== "number" || moodHistory < 1 || moodHistory > 10)
      return res.status(400).json({ error: "moodHistory must be an integer between 1 and 7" });
    if (typeof activityHistory !== "number" || activityHistory < 1 || activityHistory > 10)
      return res.status(400).json({ error: "activityHistory must be an integer between 1 and 7" });
    if (typeof gameHistory !== "number" || gameHistory < 1 || gameHistory > 10)
      return res.status(400).json({ error: "gameHistory must be an integer between 1 and 10" });

    // Generate the detailed context string
    const context = await generateUserContext(userId, selectedAssessmentsId, moodHistory, activityHistory, gameHistory);

    

    // Prepare system instruction for AI summary
    const systemInstruction = `You are an empathetic and professional AI mental health counselor. Your role is to understand the user's mental health condition, mood patterns, daily activities, and cognitive performance based on the detailed data provided. Use this comprehensive overview of the user's recent assessments, mood history, activity logs, and game performance metrics to offer a concise, supportive, and clear summary of their current mental health status. The summary should be easy to understand and helpful as a quick overview. Keep it under 80 words.`;

    // Call the AI to generate a summary based on the context
    const aiRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: context }
      ],
      response_format: { type: "text" },
    });

    const userSummary = aiRes.choices[0].message.content.trim();

    // Return both context and the AI-generated summary
    res.json({ context, summary: userSummary });
  } catch (error) {
    console.error("Error in getUserContextController:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { getUserContextController };
