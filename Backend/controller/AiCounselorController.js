const Doctor = require("../model/models").doctorSchemaExp;
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY_THREE });
const Assessment = require("../model/models").Assessment; 
const MoodEntry = require("../model/models").MoodEntry; 
const ActivityEntry = require("../model/models").ActivityEntry; 


// Ai 