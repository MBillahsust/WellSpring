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

module.exports = {
  addMood,
  getMoodByUser,
  deleteMoodById,
  addActivity,
  getActivityByUser,
  deleteActivityById
};

