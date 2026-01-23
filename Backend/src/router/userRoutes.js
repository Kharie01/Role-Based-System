import { Router } from "express";
import express from "express"

import { validate } from "../middleware/validate.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { protect } from "../middleware/protect.js";
import { loginLimiter } from "../middleware/loginLimiter.js";
import {createUser, 
        validateUser, 
        getProfile, 
        getAllUser} from '../controller/userController.js'
import { registerSchema } from "../validation/user.validation.js";
import { loginSchema } from "../validation/auth.validation.js";
import { restrictTo } from "../middleware/authorize.js";

const router = express.Router();

router.post(
        "/register", 
        validate(registerSchema), 
        createUser);

router.post(
        "/login", 
        validate(loginSchema), 
        loginLimiter, 
        validateUser);

router.get(
        "/profile", 
        protect, 
        getProfile);

router.get(
        "/users", 
        protect, 
        restrictTo("admin"), 
        getAllUser);

export default router