import express from "express";
import {
  addChat,
  deleteChat,
  getChat,
  getChats,
  readChat
} from "../controllers/chat.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/",verifyToken, getChats);
router.post("/", verifyToken, addChat);
router.delete("/:id", verifyToken, deleteChat);
router.get("/:id", verifyToken, getChat);
router.put("/read/:id", verifyToken, readChat);

export default router;
