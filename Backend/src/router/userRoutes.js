import { Router } from "express";
import express from "express"
import {createUser, validateUser, getProfile, getAllUser} from '../controller/userController.js'
import { isAdmin } from "../middleware/isAdmin.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", validateUser);
router.get("/profile", protect, getProfile);
router.get("/users", protect, isAdmin, getAllUser)

export default router