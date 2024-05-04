import React, { useEffect, useState } from "react";
import "./agentProfile.scss";
import Moment from "moment";
import apiRequest from "../../lib/apiRequest";
import { numberWithSpace } from "../../utils/numberWithSpace";
import PulseAnimationSingle from "../../ui/PulseAnimationSingle";

const AgentProfile = ({ agent }) => {
  const [data, setData] = useState();

  useEffect(() => {
    const getAgentsPosts = async () => {
      try {
        const res = await apiRequest.get(`/users/agentStats/${agent.id}`);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAgentsPosts();
  }, []);

  if (!data) return <PulseAnimationSingle/>

  return (
    <div className="agentInfoContainer">
      <img src={agent.avatar || "/noavatar.jpg"} alt="" />
      <div className="verticalLine" />
      <div className="agentsInfo">
        <div className="top">
          <div className="leftTop">
            <h2>
              <b>{agent.username}</b>
            </h2>
            <span>
              <b>{agent.email}</b>
            </span>
          </div>
          <div className="rightTop">
            <span>
              On the website from:{" "}
              <b>{Moment(agent.createdAt).format("MMM yyyy")}</b>
            </span>
          </div>
        </div>
        <div className="bottom">
          <div className="infoBottom">
            <span className="stat">
              <b style={{ color: "darkorange" }}>RENT :</b>
              <b> {data?.RentCount}</b>
            </span>
            <span className="stat">
              from:{" "}
              <b>
                {data?.LowestRent === null
                  ? 0
                  : numberWithSpace(data?.LowestRent?.price)}{" "}
                $
              </b>
            </span>
            <span className="stat">
              to:{" "}
              <b>
                {data?.HighestRent === null
                  ? 0
                  : numberWithSpace(data?.HighestRent?.price)}{" "}
                $
              </b>
            </span>
          </div>
          <div className="infoBottom">
            <span className="stat">
              <b style={{ color: "darkorange" }}>SALE :</b> <b>{data?.SaleCount}</b>
            </span>
            <span className="stat">
              from:{" "}
              <b>
                {data?.LowestSale === null
                  ? 0
                  : numberWithSpace(data?.LowestSale?.price)}{" "}
                $
              </b>
            </span>
            <span className="stat">
              to:{" "}
              <b>
                {data?.HighestSale === null
                  ? 0
                  : numberWithSpace(data?.HighestSale?.price)}{" "}
                $
              </b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
