const Doctor = require("../model/models").doctorSchemaExp;
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY_TWO });
const Assessment = require("../model/models").Assessment; 
const MoodEntry = require("../model/models").MoodEntry; 
const ActivityEntry = require("../model/models").ActivityEntry; 




const createDoctor = async (req, res) => {
  try {
    const { name, title, position, teaches, city, chamber, phone } = req.body;

    if (!name || !chamber || !phone) {
      return res.status(400).json({ error: 'Name, chamber, and phone are required' });
    }

    const newDoctor = new Doctor({
      name,
      title,
      position,
      teaches,
      city,
      chamber,
      phone
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor profile created successfully', doctor: newDoctor });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




async function summarizeAssessmentText(userId) {
  const assessments = await Assessment.find({ userId })
    .sort({ takenAt: -1 })
    .limit(3)
    .select("assessmentName assessmentResult assessmentScore recommendation");

  if (!assessments.length) return "";

  const formatted = assessments.map(a =>
    `Assessment Name: ${a.assessmentName || "N/A"}\nResult: ${a.assessmentResult || "N/A"}\nScore: ${a.assessmentScore || "N/A"}\nRecommendation: ${a.recommendation || "N/A"}`
  ).join("\n\n");

  const prompt = `You are a mental health expert. Based on the following recent assessment details, provide a detailed summary of the user's mental health state and suitable recommendations for treatment or doctor referral.\n\n${formatted}`;

  const aiRes = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a mental health expert summarizing user assessment data." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "text" },
  });

  return aiRes.choices[0].message.content.trim();
}

async function summarizeMoodText(userId) {
  const moods = await MoodEntry.find({ userId })
    .sort({ time: -1 })
    .limit(5)
    .select("mood notes time");

  if (!moods.length) return "";

  const formatted = moods.map(m =>
    `Mood: ${m.mood || "N/A"}\nNotes: ${m.notes || "N/A"}\nTime: ${m.time || "N/A"}`
  ).join("\n\n");

  const prompt = `You are a mental health expert. Based on the following recent mood entries, provide a detailed summary of the user's emotional state, mood patterns, and any relevant recommendations for wellbeing or potential follow-up.\n\n${formatted}`;

  const aiRes = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a mental health expert summarizing user mood data." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "text" },
  });

  return aiRes.choices[0].message.content.trim();
}

async function summarizeActivityText(userId) {
  const activities = await ActivityEntry.find({ userId })
    .sort({ time: -1 })
    .limit(3)
    .select("activity notes time");

  if (!activities.length) return "";

  const formatted = activities.map(a =>
    `Activity: ${a.activity || "N/A"}\nNotes: ${a.notes || "N/A"}\nTime: ${a.time || "N/A"}`
  ).join("\n\n");

  const prompt = `You are an expert analyst. Based on the following recent activity entries, provide a detailed summary of the user's recent activities, how they might relate to their mental and physical wellbeing, and any relevant recommendations.\n\n${formatted}`;

  const aiRes = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are an expert analyst summarizing user activity data." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "text" },
  });

  return aiRes.choices[0].message.content.trim();
}


const recommendDoctorsController = async (req, res) => {
  try {
    const userId = req.userId;
    const { assessmentData, moodData, activityData, city } = req.body;

    if (!city) return res.status(400).json({ error: "City is required" });

    const doctorsInCity = await Doctor.find({ city });
    if (!doctorsInCity.length) return res.status(404).json({ error: "No doctors found in this city" });

    let combinedSummary = "";
    if (assessmentData) combinedSummary += await summarizeAssessmentText(userId) + "\n\n";
    if (moodData) combinedSummary += await summarizeMoodText(userId) + "\n\n";
    if (activityData) combinedSummary += await summarizeActivityText(userId) + "\n\n";

    if (!combinedSummary.trim()) return res.status(400).json({ error: "No data to summarize" });


    const doctorIds = doctorsInCity.map(d => d._id.toString());

    const selectionPrompt = `You are a medical AI consultant. Based on the following user summary and the doctors practicing in ${city}, select at least two doctor ObjectId strings that best match the user's condition.\n\nUser summary:\n${combinedSummary}\n\nDoctors available (IDs):\n${doctorIds.join(", ")}\n\nReturn ONLY a JSON array of at least two doctor ObjectId strings, and at most four.`;

    const aiRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You return only a JSON array of doctor ObjectIds, no extra text." },
        { role: "user", content: selectionPrompt },
      ],
      response_format: { type: "text" },
    });

    let doctorIdArray;
    try {
      doctorIdArray = JSON.parse(aiRes.choices[0].message.content.trim());
    } catch {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    const validIds = doctorIdArray.filter(id => doctorIds.includes(id));
    if (validIds.length < 2) return res.status(500).json({ error: "AI returned fewer than 2 valid doctor IDs" });

    const recommendedDoctors = await Doctor.find({ _id: { $in: validIds } });
    res.json({ recommendedDoctors });
  } catch (error) {
    console.error("Error in recommendDoctorsController:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};







module.exports = { createDoctor, getAllDoctors , recommendDoctorsController};