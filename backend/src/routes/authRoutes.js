import express from "express";
import User from "../models/Users.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: "15d" });
}

router.post("/register", async (req, res) => {
    try {
        // Kiểm tra xem req.body có tồn tại không
    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
      }

      const { email, username, password } = req.body;
      
        if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password should be at least 6 char long"});
        }
        if(username.length < 3){
            return res.status(400).json({message: "Username should be at least 3 char long"});
        }

        //check if user already exist

        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({ message: "Email already exists"});
        }
        const existingUsername = await User.findOne({ username });
        if(existingUsername) {
            return res.status(400).json({ message: "Username already exists"});
        }

        // get random avatar
        const profileImage = `https://api.dicebear.com/9.x/adventurer/svg?seed=Nolan${username}`;
        
        const user = new User({
            email,
            username,
            password,
            profileImage,
        });
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }, 
        });
    } catch (error) {
        console.log("Error in register", error);
        res.status(500).json({ message: "Internal server error"});
    }
});

router.get("/login", async (req, res) => {
    res.send("login");
});

export default router;