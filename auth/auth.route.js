import express from "express";
import { register, login, profile, logout } from "./auth.controller.js";
import userSchema from "../validator/user.validator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(userSchema), register);
router.post("/login", login);
router.get("/profile", profile);
router.post("/logout", logout);

export default router;
