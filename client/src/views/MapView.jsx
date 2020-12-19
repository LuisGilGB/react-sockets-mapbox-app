import React from "react";
import useMapbox from "../hooks/useMapbox";

const MapView = () => {
  const { setMapRef } = useMapbox();

  return (
    <>
      <div id="coords-tag"></div>
      <div id="map-wrapper" ref={setMapRef}></div>
    </>
  );
};

export default MapView;
