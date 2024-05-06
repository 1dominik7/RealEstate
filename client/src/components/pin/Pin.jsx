import React, { useEffect } from "react";
import "./pin.scss";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const Pin = ({ item }) => {

  useEffect(() =>{

  },[item])

  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <img src={item.img} alt="" />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
