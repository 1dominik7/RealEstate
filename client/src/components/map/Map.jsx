import React, { useEffect } from "react";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import Pin from "../pin/Pin";

const Map = ({ items }) => {
  const centerInfo =
    items?.length >= 1 ? [items[0]?.latitude, items[0]?.longitude] : [51, 19];

  const bounds = [];
  items.map((item, i) => {
    bounds.push([item.latitude, item.longitude]);
  });

  return (
    <MapContainer
      key={centerInfo}
      bounds={bounds}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
};

export default Map;
