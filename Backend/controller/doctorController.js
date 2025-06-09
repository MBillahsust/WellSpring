const Doctor = require("../model/models").doctorSchemaExp;


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











module.exports = { createDoctor, getAllDoctors };