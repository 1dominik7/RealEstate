import React, { useContext, useEffect, useState } from "react";
import "./card.scss";
import {
  Link,
  useNavigate,
  useRevalidator,
} from "react-router-dom";
import { numberWithSpace } from "../../utils/numberWithSpace";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import PulseAnimationContainerCard from "../../ui/PulseAnimationContainerCard";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import moment from "moment";

const Card = ({ item, promote, setPostId, setOpenPostDelete }) => {
  const [savedPost, setSavedPost] = useState();
  let revalidator = useRevalidator();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const dataNow = new Date();

  useEffect(() => {
    if (currentUser) {
      const getUserSavedPost = async () => {
        try {
          const res = await apiRequest.get("/users/save");
          setSavedPost(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getUserSavedPost();
    }
  }, [revalidator]);

  const handleSave = async () => {
    if (!currentUser) return navigate("/login");

    try {
      await apiRequest.post("/users/save", { postId: item.id });
      revalidator.revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  if (!item) return <PulseAnimationContainerCard />;

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.city}, </span>
          <span>{item.address}</span>
        </p>
        <p className="price">$ {numberWithSpace(item.price)}</p>
        {item?.userId === currentUser?.id &&
          Date.parse(item.promotedTill) >= Date.parse(dataNow) && (
            <p className="promotedDate">
              Promoted Till: {moment(item.promotedTill).format("DD-MM-YYYY")}
            </p>
          )}
        <div className="bottom"  style={{
                alignSelf: item.property === "land" ? "flex-end" : null
              }}>
          {item.property !== "land" && (
            <div className="features">
              <div className="feature">
                <img src="/bed.png" alt="" />
                <span>{item.bedroom} bedroom</span>
              </div>
              <div className="feature">
                <img src="/bath.png" alt="" />
                <span>{item.bathroom} bathroom</span>
              </div>
            </div>
          )}
          {promote && (
            <div
              className="propertyOption"
            >
              <div
                className="edit"
                onClick={() =>
                  navigate(`/editPost/${item.id}`, { state: item })
                }
              >
                Edit
              </div>
              <div
                className="promote"
                onClick={() => navigate("/promote", { state: item })}
              >
                <ElectricBoltIcon
                  style={{ color: "rgba(254, 205, 81, 1)" }}
                  size={20}
                />
                <span>Promote</span>
              </div>
              <div
                className="finish"
                onClick={() => {
                  setOpenPostDelete(true);
                  setPostId(item.id);
                }}
              >
                Finish
              </div>
            </div>
          )}
          {item?.userId !== currentUser?.id && (
            <div className="icons">
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: savedPost?.find(
                    (post) => post.postId === item.id
                  )
                    ? "#fece51"
                    : "white",
                }}
                className="icon"
              >
                <img src="/save.png" alt="" />
                {savedPost?.find((post) => post.postId === item.id)
                  ? "Place Saved"
                  : "Save the Place"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
