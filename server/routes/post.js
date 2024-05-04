import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addPost, deletePost, getByCity, getPost, getPosts, getPromotedPosts, promotePost, updatePost } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/promoted/true", getPromotedPosts);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.put("/promote/:id", verifyToken, promotePost);
router.get("/city/countCity", getByCity);

export default router;
