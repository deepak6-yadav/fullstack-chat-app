import User from "../models/user.model.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (password.trim().length < 6) {
      return res
        .status(400)
        .send({ message: "Password must have atleast 6 characters." });
    }

    const isExisting = await User.findOne({ email });
    if (isExisting)
      return res.status(400).send({ message: "Email already exists" });

    const user = new User({ fullName, email, password });
    await user.save();

    const token = await user.generateAuth();

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevents XSS attacks
      sameSite: "strict", // CSRF attacks
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(201).send({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const isValidPassword = bycrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const token = await user.generateAuth();
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.cookie("jwt", "", { maxAge: 0 });
    res.send({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res
        .status(400)
        .send({ message: "Please upload a profile picture" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    next(error);
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    next(error);
  }
};
