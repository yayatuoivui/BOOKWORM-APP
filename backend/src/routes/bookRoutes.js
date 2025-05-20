import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
const router = express.Router();

//create a book
router.post("/", protectRoute, async (req, res) => {
   try {
    const { title, caption, rating, image } = req.body;

    // Validate the input
    if (!image || !title || !caption || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // Create a new book object
    const newBook = new Book ({
        title,
        caption,
        rating,
        image: imageUrl,
        user: req.user._id, // Assuming req.user is set by the protectRoute middleware
      });

    await newBook.save();
    res.status(201).json(newBook)
    } catch (error) {
        console.log("Error creating book:", error);
        res.status(500).json({ message: error });
    }

});

export default router;