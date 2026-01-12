import { Router } from "express";
import express from "express"
import {createUser, validateUser} from '../controller/userController.js'

const router = express.Router();

router.post("/register", createUser);
router.post("/login/:id", validateUser);

export default router