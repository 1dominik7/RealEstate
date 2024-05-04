import express from "express";
import { login, logout, register } from "../controllers/auth.js";
import validate from "../middleware/validator.js";
import { newUserSchema } from "../utils/validationSchema.js";

const router = express.Router();

router.post("/register",validate(newUserSchema) , register);

router.post("/login", login);

router.post("/logout", logout);

export default router;
