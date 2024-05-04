import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });
    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      return res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      return res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post!" });
  }
};

export const getUserSaved = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findMany({
      where: {
        userId: tokenUserId,
      },
    });

    res.status(200).json(savedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get saved post!" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        lastMessage: {
          not: null,
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get notification number!" });
  }
};

export const getUserPosts = async (req, res) => {
  const { id } = req.params;

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        userId: id,
      },
    });
    const user = await prisma.user.findUnique({
      where: { id },
    });

    res.status(200).json({
      userPosts,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { agent: true },
    });

    res.status(200).json({ agents });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getAgentsStats = async (req, res) => {
  const { id } = req.params;

  try {
    const LowestRent = await prisma.post.findFirst({
      where: {
        userId: id,
        type: "rent",
      },
      orderBy: {
        price: "asc",
      },
      select: {
        price: true,
      },
      take: 1,
    });

    const HighestRent = await prisma.post.findFirst({
      where: {
        userId: id,
        type: "rent",
      },
      orderBy: {
        price: "desc",
      },
      select: {
        price: true,
      },
      take: 1,
    });

    const LowestSale = await prisma.post.findFirst({
      where: {
        userId: id,
        type: "buy",
      },
      orderBy: {
        price: "asc",
      },
      select: {
        price: true,
      },
      take: 1,
    });

    const HighestSale = await prisma.post.findFirst({
      where: {
        userId: id,
        type: "buy",
      },
      orderBy: {
        price: "desc",
      },
      select: {
        price: true,
      },
      take: 1,
    });

    const RentCount = await prisma.post.count({
      where: {
        userId: id,
        type: "rent",
      },
    });

    const SaleCount = await prisma.post.count({
      where: {
        userId: id,
        type: "buy",
      },
    });

    res.status(200).json({
      LowestRent,
      HighestRent,
      LowestSale,
      HighestSale,
      RentCount,
      SaleCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get agents stats!" });
  }
};
