const prisma = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const SignUp = async (req, res) => {
  try {
    const { email, password, name, age, weight } = req.body;

    

    if (!email || !password || !name || !age || !weight) {
      return res.status(400).json({ error: "All fields are required" });
    }

    

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    

    

    

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name, age, weight },
    });

    

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const Login = async (req, res) => {
        try {
          const { email, password } = req.body;
      
          if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
          }
      
          const user = await prisma.user.findUnique({ where: { email } });
      
          if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
          }
      
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
          }
      
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      
          res.status(200).json({ message: "Login successful", token });
        } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
        }
      };


// Get the logged-in user's information
const getUserInfo = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        weight: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





module.exports = { SignUp, Login, getUserInfo };
