import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { payment } from "../controllers/stripe.js";

const router = express.Router();

router.post('/create-checkout-session', payment)

export default router;
