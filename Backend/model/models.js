// models.js
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Assessments Schema
const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessmentName: String,
  assessmentResult: String,
  assessmentScore: String,
  recommendation: String,
  takenAt: String
});
const Assessment = mongoose.model('Assessment', assessmentSchema);

// MoodEntry Schema
const moodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: String,
  notes: String,
  time: String
});
const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

// ActivityEntry Schema
const activityEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity: String,
  notes: String,
  time: String
});
const ActivityEntry = mongoose.model('ActivityEntry', activityEntrySchema);

// ResearchQuestionnaire Schema
const researchSchema = new mongoose.Schema({
  email: { type: String, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  Q1: Number, Q2: Number, Q3: Number, Q4: Number, Q5: Number,
  Q6: Number, Q7: Number, Q8: Number, Q9: Number, Q10: Number,
  Q11: Number, Q12: Number, Q13: Number, Q14: Number, Q15: Number,
  Q16: Number, Q17: Number, Q18: Number, Q19: Number, Q20: Number,
  Q21: Number, Q22: Number, Q23: Number, Q24: Number, Q25: Number,
  Q26: Number, Q27: Number, Q28: Number, Q29: Number, Q30: Number,
  Q31: Number, Q32: Number, Q33: Number, Q34: Number, Q35: Number,
  Q36: Number, Q37: Number, Q38: Number, Q39: Number, Q40: Number,
  Q41: Number, Q42: Number, Q43: Number, Q44: Number, Q45: Number,
  Q46: Number, Q47: Number, Q48: Number, Q49: Number, Q50: Number,
  Q51: Number, Q52: Number, Q53: Number, Q54: Number, Q55: Number
});
const ResearchQuestionnaire = mongoose.model('ResearchQuestionnaire', researchSchema);

// GameScore Model
const GameScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  game_name: { type: String, required: true },
  game1Score: { type: Number, required: true },
  game2Score: { type: Number, required: true },
  game3Score: { type: Number, required: true },
  LastAvgScore: { type: Number, required: true },
  highestAvgScore: { type: Number, required: true }
}, { timestamps: true });

const GameScore = mongoose.model("GameScore", GameScoreSchema);

// GameAssessment Model
const GameAssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  game_name: { type: String, required: true },
  recommendation: { type: String, required: true },
  attention: { type: Number, required: true },
  focus: { type: Number, required: true },
  short_term_memory: { type: Number, required: true },
  reaction_time: { type: Number, required: true },
  working_memory: { type: Number, required: true },
  hand_eye_coordination: { type: Number, required: true },
  stress_response: { type: Number, required: true },
  feedback: { type: String }
}, { timestamps: true });

const GameAssessment = mongoose.model("GameAssessment", GameAssessmentSchema);





// Doctor info
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  position: {
    type: String
  },
  teaches: {
    type: String
  },
  city: {
    type: String
  },
  chamber: {
    type: String
  },
  phone: {
    type: String
  }
});

const doctorSchemaExp = mongoose.model('Doctor', doctorSchema);



// Export all models
module.exports = {
  User,
  Assessment,
  MoodEntry,
  ActivityEntry,
  ResearchQuestionnaire,
  GameScore,
  GameAssessment,
  doctorSchemaExp
};
