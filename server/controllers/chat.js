import prisma from "../lib/prisma.js";

export const addChat = async (req, res) => {
  const {postId} = req.body
  const {receiverId} = req.body
  const tokenUserId = req.userId;
  

  const checkIfChatExist = await prisma.chat.findFirst({
    where:{
      userIDs: {
        hasSome: [tokenUserId, receiverId],
      },
      postId: postId
    }
  })

  if(checkIfChatExist) return res.status(200).json(checkIfChatExist);

  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        postId: postId
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat" });
  }
};


export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        }
      });
      chat.receiver = receiver;

      const post = await prisma.post.findUnique({
        where: {
          id: chat.postId,
        },
        select: {
          title: true,
          price: true,
          images: true,
          address: true,
          city: true,
        }
      });
      chat.post = post;
    }

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat" });
  }
};

export const deleteChat = async (req, res) => {
  const tokenUserId = req.userId;
  
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });
  
    if (!chat ) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.chat.delete({
      where: {id: req.params.id}
    })
    res.status(200).json({ message: "Chat deleted" });
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat" });
  }
};