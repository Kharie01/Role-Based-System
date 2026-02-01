import { Router } from "express";
import express from "express"

import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/protect.js";
import { loginLimiter } from "../middleware/loginLimiter.js";
import {createUser, 
        validateUser, 
        getProfile, 
        getAllUser,
        logoutUser} from '../controller/userController.js'
import { refreshAccessToken } from '../controller/authController.js'
import { registerSchema } from "../validation/user.validation.js";
import { loginSchema } from "../validation/auth.validation.js";
import { requirePermission } from "../middleware/authorizePermission.js";
import { PERMISSIONS } from "../config/permissions.js";
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
        validateUser
        );

router.get(
        "/profile", 
        protect,
        requirePermission(PERMISSIONS.PROFILE_READ), 
        getProfile
        );

router.get(
        "/users", 
        protect,
        restrictTo("admin"),
        requirePermission(PERMISSIONS.USER_READ), 
        getAllUser
        );

router.post(
        "/logout",
        logoutUser
        );

router.post("/refresh-token", 
        refreshAccessToken);  

export default router