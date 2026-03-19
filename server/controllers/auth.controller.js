import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { username, email, password, role, department } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password:hashedPassword, role, department });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 3 * 60 * 60 * 1000,
        });
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user:{
                _id:user._id,
                username:user.username,
                email:user.email,
                role:user.role,
                department:user.department
            }
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Failed to register user",
            error:error.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success:false,
                message:"Invalid password"
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 3 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            user:{
                _id:user._id,
                username:user.username,
                email:user.email,
                role:user.role,
                department:user.department
            }
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Failed to login user",
            error:error.message
        });
    }
}

export const getme = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success:true,
            user:{
                _id:user._id,
                username:user.username,
                email:user.email,
                role:user.role,
                department:user.department
            }
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Failed to get user",
            error:error.message
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 0,
        });
        res.status(200).json({
            success:true,
            message:"User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Failed to logout user",
            error:error.message
        });
    }
}

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find(
      { role: "teacher" },
      "username department" 
    );
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};