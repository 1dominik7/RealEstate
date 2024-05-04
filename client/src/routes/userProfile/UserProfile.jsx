import React from "react";
import "./userProfile.scss";
import { useLoaderData } from "react-router-dom";
import PulseAnimationContainerProfile from "../../ui/PulseAnimationContainerProfile";
import Card from "../../components/card/Card";
import Moment from 'moment';

const UserProfile = () => {
  const { data } = useLoaderData();

  if (!data) {
    <PulseAnimationContainerProfile />;
  }

  return (
    <div className="userProfilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={data.user.avatar || "/noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{data.user.username}</b>
            </span>
            <span>
              Email: <b>{data.user.email}</b>
            </span>
            <span>Account created: <b>{Moment(data.user.createdAt).format('MMM yyyy')}</b></span>
          </div>
          <div className="title">
            <h1>{data.user.username}'s properties</h1>
            <div className="propertyList">
              {data?.userPosts?.length > 0 ? (
                data?.userPosts?.map((post) => (
                  <div key={post.id} className="postContainer">
                    <Card item={post} />
                  </div>
                ))
              ) : (
                <div className="noProperties">
                  <img className="logopng" src="/logo.png" alt="" />
                  <h1>No Properties</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
