const prisma = require("../db");


// Add a new mood entry
const addMood = async (req, res) => {
  try {
    const userId = req.userId;
    const { mood, notes, time } = req.body;

    if (!mood || !notes || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMood = await prisma.moodEntry.create({
      data: {
        userId,
        mood,
        notes,
        time
      }
    });

    res.status(201).json({ message: "Mood entry added successfully", mood: newMood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Delete Mood by id

const deleteMoodById = async (req, res) => {
  try {
    const userId = req.userId;
    const moodId = parseInt(req.params.id);

    if (isNaN(moodId)) {
      return res.status(400).json({ error: "Invalid mood id" });
    }

    const existingMood = await prisma.moodEntry.findUnique({
      where: { id: moodId }
    });

    if (!existingMood || existingMood.userId !== userId) {
      return res.status(404).json({ error: "Mood entry not found or access denied" });
    }

    await prisma.moodEntry.delete({
      where: { id: moodId }
    });

    res.status(200).json({ message: "Mood entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






// Get all mood entries for the logged-in user
const getMoodByUser = async (req, res) => {
  try {
    const userId = req.userId;

    const moods = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { id: "desc" } // optional: latest first
    });

    res.status(200).json({ moods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// Add a new activity entry
const addActivity = async (req, res) => {
  try {
    const userId = req.userId;
    const { activity, notes, time } = req.body;

    if (!activity || !notes || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newActivity = await prisma.activityEntry.create({
      data: {
        userId,
        activity,
        notes,
        time
      }
    });

    res.status(201).json({ message: "Activity entry added successfully", activity: newActivity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






// Get all activity entries for the logged-in user
const getActivityByUser = async (req, res) => {
  try {
    const userId = req.userId;

    const activities = await prisma.activityEntry.findMany({
      where: { userId },
      orderBy: { id: "desc" }
    });

    res.status(200).json({ activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






// Delete activity by ID
const deleteActivityById = async (req, res) => {
  try {
    const userId = req.userId;
    const activityId = parseInt(req.params.id);

    if (isNaN(activityId)) {
      return res.status(400).json({ error: "Invalid activity id" });
    }

    const existingActivity = await prisma.activityEntry.findUnique({
      where: { id: activityId }
    });

    if (!existingActivity || existingActivity.userId !== userId) {
      return res.status(404).json({ error: "Activity entry not found or access denied" });
    }

    await prisma.activityEntry.delete({
      where: { id: activityId }
    });

    res.status(200).json({ message: "Activity entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper: Categorize activity title
function categorizeActivity(title) {
  const t = title.toLowerCase();
  // Mental Activities
  const mental = [
    'study', 'problem', 'read', 'plan', 'work', 'computer', 'teach', 'meeting', 'decision', 'analyz', 'manage emotion', 'learn', 'reason', 'think'
  ];
  // Physical Activities
  const physical = [
    'walk', 'exercise', 'sport', 'lift', 'clean', 'garden', 'dance', 'cook', 'commute', 'labor', 'run', 'jog', 'swim', 'yoga', 'bike', 'cycling'
  ];
  // Spiritual Activities
  const spiritual = [
    'prayer', 'meditat', 'religious', 'spiritual', 'mindful', 'contemplat', 'compassion', 'worship', 'faith', 'reflection'
  ];
  // Social Activities
  const social = [
    'convers', 'gather', 'team', 'call', 'family', 'help', 'group', 'event', 'social media', 'friend', 'meet', 'chat', 'party', 'hangout', 'neighbor'
  ];
  // Emotional Activities
  const emotional = [
    'journal', 'emotional', 'therapy', 'cry', 'laugh', 'love', 'anger', 'feel', 'express', 'vent', 'counsel', 'support', 'session'
  ];
  // Creative Activities
  const creative = [
    'draw', 'write', 'paint', 'design', 'play instrument', 'sing', 'act', 'craft', 'create', 'art', 'music', 'compose', 'sculpt', 'photograph', 'film'
  ];

  if (mental.some(k => t.includes(k))) return 'Mental Activities';
  if (physical.some(k => t.includes(k))) return 'Physical Activities';
  if (spiritual.some(k => t.includes(k))) return 'Spiritual Activities';
  if (social.some(k => t.includes(k))) return 'Social Activities';
  if (emotional.some(k => t.includes(k))) return 'Emotional Activities';
  if (creative.some(k => t.includes(k))) return 'Creative Activities';
  return 'Other';
}

// Endpoint: Get last 10 activities categorized for pie chart
const getLast10ActivitiesPie = async (req, res) => {
  try {
    const userId = req.userId;
    const activities = await prisma.activityEntry.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
      take: 10
    });
    // Count by category
    const counts = {
      'Mental Activities': 0,
      'Physical Activities': 0,
      'Spiritual Activities': 0,
      'Social Activities': 0,
      'Emotional Activities': 0,
      'Creative Activities': 0,
      'Other': 0
    };
    activities.forEach(a => {
      const cat = categorizeActivity(a.activity);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    res.json({
      data: Object.entries(counts).map(([category, value]) => ({ category, value })),
      raw: activities.map(a => ({ id: a.id, activity: a.activity, category: categorizeActivity(a.activity) }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addMood,
  getMoodByUser,
  deleteMoodById,
  addActivity,
  getActivityByUser,
  deleteActivityById,
  getLast10ActivitiesPie
};

