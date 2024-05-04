import React from "react";
import "./list.scss";
import Card from "../card/Card";

const List = ({ posts, promote, setPostId,setOpenPostDelete }) => {
  return (
    <div className="list">
      {posts.map((item) => (
          <Card promote={promote} key={item.id} item={item} setPostId={setPostId} setOpenPostDelete={setOpenPostDelete}/>
      ))}
    </div>
  );
};

export default List;
