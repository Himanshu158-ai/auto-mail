import express from "express";
import { register,login,getme,getAllTeachers } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/me",protect,getme);
router.get("/teachers",protect, getAllTeachers);

export default router;