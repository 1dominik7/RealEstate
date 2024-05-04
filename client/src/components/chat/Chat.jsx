import React, { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { numberWithSpace } from "../../utils/numberWithSpace";
import { Link, useRevalidator } from "react-router-dom";

const Chat = ({ chats, setOpenChat, openChat }) => {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  let revalidator = useRevalidator();

  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver, post) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver, post });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;

    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;

    try {
      const res = await apiRequest.post("/messages/" + openChat.id, { text });
      setOpenChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: openChat.data.userId,
        data: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

  useEffect(() => {
    const readMessage = async () => {
      try {
        await apiRequest.put("/chats/read/" + openChat.id);
      } catch (error) {
        console.log(error);
      }
    };

    if (openChat && socket) {
      socket.on("getMessage", (data) => {
        if (openChat.id === data.chatId) {
          setOpenChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          readMessage();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

  const deleteChatHandler = async (e,id) => {
    e.stopPropagation();
    try {
      await apiRequest.delete("/chats/" + id);
      revalidator.revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat">
      <div
        className="messages"
        style={{ paddingBottom: chat !== null ? "0" : "5px" }}
      >
          <h1>Messages</h1>
        {chats?.map((c) => (
          c.lastMessage && 
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver, c.post)}
          >
            <div
              className="deleteChat"
              onClick={(e) => deleteChatHandler(e, c.id)}
            >
              Delete chat
            </div>
            <div className="user">
              <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
              <span>{c.receiver.username}</span>
            </div>
            <p className="lastMessage">{c.lastMessage}</p>
            <Link to={`/${c.postId}`} className="messageRight">
              <p className="title">
                {c.post.title.length > 30
                  ? c.post.title.substring(0, 30) + "..."
                  : c.post.title}
              </p>
              <img
                src={c.post.images[0] || "/logo.png"}
                className="offerImage"
                alt=""
              />
              <p className="price">$ {numberWithSpace(c.post.price)}</p>
            </Link>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
              {chat.receiver.username}
              <div className="userPostInfo">
                <div className="desc">
                  <span>
                    {" "}
                    {chat.post.title.length > 30
                      ? chat.post.title.substring(0, 30) + "..."
                      : chat.post.title}
                  </span>
                  <span>{chat.post.city}</span>
                </div>
                <img src={chat.post.images[0] || "/logo.png"} alt="" />
              </div>
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                key={message.id}
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
      {openChat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={openChat?.data?.user?.avatar || "/noavatar.jpg"} alt="" />
              {openChat?.data?.user?.username}
              <div className="userPostInfo">
                <div className="desc">
                  <span>
                    {" "}
                    {openChat?.data?.title?.length > 30
                      ? openChat?.data?.title.substring(0, 30) + "..."
                      : openChat?.data?.title}
                  </span>
                  <span>{openChat?.data?.city}</span>
                </div>
                <img src={openChat?.data?.images[0] || "/logo.png"} alt="" />
              </div>
            </div>
            <span className="close" onClick={() => setOpenChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {openChat?.messages?.map((message) => (
              <div
                className="chatMessage"
                key={message?.id}
                style={{
                  alignSelf:
                    message?.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message?.userId === currentUser.id ? "right" : "left",
                }}
              >
                <p>{message?.text}</p>
                <span>{format(message?.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmitMessage} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
