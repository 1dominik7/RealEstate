import React, { Suspense, useContext, useEffect, useState } from "react";
import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from "react-router-dom";
import DOMPurify from "dompurify";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { numberWithSpace } from "../../utils/numberWithSpace";
import Chat from "../../components/chat/Chat";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import Alert from "../../ui/Alert";

const SinglePage = () => {
  const { data } = useLoaderData();
  const [post, setPost] = useState();
  const [openPostDelete, setOpenPostDelete] = useState(false);
  let revalidator = useRevalidator();
  const [saved, setSaved] = useState(data?.isSaved);
  const [openChat, setOpenChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) return navigate("/login");

    setSaved(!saved);
    try {
      await apiRequest.post("/users/save", { postId: data.id });
    } catch (error) {
      console.log(error);
      setSaved(!saved);
    }
  };

  const openChatMessage = async (data) => {
    if (!currentUser) return navigate("/login");
    setOpenChat(!openChat);
    try {
      const resChat = await apiRequest.post("/chats", {
        receiverId: data.userId,
        postId: data.id,
      });

      if (resChat) {
        const res = await apiRequest("/chats/" + resChat.data.id);
        if (!res.data.seenBy.includes(currentUser.id)) {
        }
        setOpenChat({ ...res.data, data });
      }
      revalidator.revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const read = async () => {
        try {
          const chatPromise = await apiRequest("/chats");
          setPost(chatPromise);
        } catch (error) {
          console.log(error.response.data.message);
        }
      };
      read();
    }
  }, [revalidator]);

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={data.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{data.title}</h1>
                <div className="desc">
                  <div className="address">
                    <img src="/pin.png" alt="" />
                    <span>{data.city}, </span>
                    <span>{data.address}</span>
                  </div>
                  <div className="price">$ {numberWithSpace(data.price)}</div>
                  <div
                    className="bottom"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(data.postDetail.desc),
                    }}
                  ></div>
                </div>
              </div>
              <Link
                className="user"
                to={
                  currentUser?.id === data.userId
                    ? "/profile"
                    : `/userProfile/${data.userId}`
                }
              >
                <img src={data.user.avatar || "/noavatar.jpg"} alt="" />
                <span>{data.user.username}</span>
              </Link>
            </div>
          </div>
          {data.userId === currentUser?.id && (
            <div className="currentUserOptions">
              <div
                className="edit"
                onClick={() =>
                  navigate(`/editPost/${data.id}`, { state: data })
                }
              >
                Edit
              </div>
              <div
                className="promote"
                onClick={() => navigate("/promote", { state: data })}
              >
                <ElectricBoltIcon
                  style={{ color: "rgba(254, 205, 81, 1)" }}
                  size={20}
                  className="icon"
                />
                <span>Promote</span>
              </div>
              <div
                className="finish"
                onClick={() => {
                  setOpenPostDelete(true);
                }}
              >
                Finish
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            {data?.property !== "land" && (
              <>
                <div className="feature">
                  <img src="/utility.png" alt="" />
                  <div className="featureText">
                    <span>Utilities</span>
                    {data.postDetail.utilities === "owner" ? (
                      <p>Owner is responsible</p>
                    ) : (
                      <p>Tenant is responsible</p>
                    )}
                  </div>
                </div>
                <div className="feature">
                  <img src="/pet.png" alt="" />
                  <div className="featureText">
                    <span>Pet Policy</span>
                    {data.postDetail.pet === "allowed" ? (
                      <p>Pets Allowed</p>
                    ) : (
                      <p>Pets not Allowed</p>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{data.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Property Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{data.postDetail.size}</span>
            </div>
            {data?.property !== "land" && (
              <>
                <div className="size">
                  <img src="/bed.png" alt="" />
                  <span>{data.bedroom} beds</span>
                </div>
                <div className="size">
                  <img src="/bath.png" alt="" />
                  <span>{data.bathroom} bathroom</span>
                </div>
              </>
            )}
          </div>
          {data?.property !== "land" && (
            <>
              <p className="title">Nearby Places</p>
              <div className="listHorizontal">
                <div className="feature">
                  <img src="/school.png" alt="" />
                  <div className="featureText">
                    <span>School</span>
                    <p>
                      {data.postDetail.school > 999
                        ? data.postDetail.school / 1000 + "km"
                        : data.postDetail.school + "m"}{" "}
                      away
                    </p>
                  </div>
                </div>
                <div className="feature">
                  <img src="/bus.png" alt="" />
                  <div className="featureText">
                    <span>Bus Stop</span>
                    <p>
                      {data.postDetail.bus > 999
                        ? data.postDetail.bus / 1000 + "km"
                        : data.postDetail.bus + "m"}{" "}
                      away
                    </p>
                  </div>
                </div>
                <div className="feature">
                  <img src="/fee.png" alt="" />
                  <div className="featureText">
                    <span>Restaurant</span>
                    <p>
                      {data.postDetail.restaurant > 999
                        ? data.postDetail.restaurant / 1000 + "km"
                        : data.postDetail.restaurant + "m"}{" "}
                      away
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[data]} />
          </div>
          {data.userId !== currentUser?.id && (
            <div className="buttons">
              <button onClick={() => openChatMessage(data)}>
                <img src="/chat.png" alt="" />
                Send a Message
              </button>
              <button
                onClick={handleSave}
                style={{ backgroundColor: saved ? "#fece51" : "white" }}
              >
                <img src="/save.png" alt="" />
                {saved ? "Place Saved" : "Save the Place"}
              </button>
            </div>
          )}
          {openChat && (
            <div className="popupChat">
              <Suspense fallback={<p>Loading...</p>}>
                <Await
                  resolve={post.data}
                  errorElement={<p>Error loading chats!</p>}
                >
                  {(data) => (
                    <Chat
                      chats={data}
                      setOpenChat={setOpenChat}
                      openChat={openChat}
                    />
                  )}
                </Await>
              </Suspense>
            </div>
          )}
        </div>
      </div>
      {openPostDelete && (
        <Alert setOpenPostDelete={setOpenPostDelete} id={data.id} />
      )}
    </div>
  );
};

export default SinglePage;
