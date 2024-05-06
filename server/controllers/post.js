import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  const city = query?.city.split(",");

  try {
    if (query.city.length === 0) {
      const posts = await prisma.post.findMany({
        where: {
          type: query.type || undefined,
          property: query.property || undefined,
          bedroom: parseInt(query.bedroom) || undefined,
          price: {
            gte: parseInt(query.minPrice) || undefined,
            lte: parseInt(query.maxPrice) || undefined,
          },
          promoted: query.promoted,
        },
      });

      return res.status(200).json(posts);
    } else {
      const posts = await prisma.post.findMany({
        where: {
          city: { in: city } || undefined,
          type: query.type || undefined,
          property: query.property || undefined,
          bedroom: parseInt(query.bedroom) || undefined,
          price: {
            gte: parseInt(query.minPrice) || undefined,
            lte: parseInt(query.maxPrice) || undefined,
          },
          promoted: query.promoted,
        },
      });

      return res.status(200).json(posts);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPromotedPosts = async (req, res) => {
  try {
    const promotedPosts = await prisma.post.findMany({
      where: { promotedTill: { gte: new Date() } },
    });
    res.status(200).json(promotedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get promoted posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res
            .status(200)
            .json({ ...post, isSaved: saved ? true : false });
        }
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  const { id } = req.params;

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          update: body.postDetail,
        },
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.chat.deleteMany({
      where: { postId: id },
    });

    await prisma.postDetail.deleteMany({
      where: { postId: id },
    });

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const promotePost = async (req, res) => {
  const { id } = req.body;
  const { promoDays } = req.body;
  const dateNow = new Date(Date.now() + 2 * (60 * 60 * 1000));

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (post.promotedTill - dateNow < 0) {
      const date = Date.now() + promoDays * 86400000;
      const updatePromotion = await prisma.post.update({
        where: { id },
        data: {
          promotedTill: {
            set: new Date(date),
          },
        },
      });
      return res.status(200).json(updatePromotion);
    } else {
      const dateTill = post.promotedTill.getTime();

      const newDate = dateTill + promoDays * 86400000;

      const updatePromotion = await prisma.post.update({
        where: { id },
        data: {
          promotedTill: {
            set: new Date(newDate),
          },
        },
      });
      return res.status(200).json(updatePromotion);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to promotion post" });
  }
};

export const getByCity = async (req, res) => {

  try {
    const posts = await prisma.post.groupBy({
      by: ["city"],
      _count: {
        city: true,
      },
      orderBy: {
        city: "asc",
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};
