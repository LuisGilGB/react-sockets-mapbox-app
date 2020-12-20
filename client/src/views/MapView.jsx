import React, { useEffect } from "react";
import useMapbox from "../hooks/useMapbox";

const MapView = () => {
  const { newMarker$, markerDrag$, setMapRef } = useMapbox();

  useEffect(() => {
    newMarker$.subscribe((markerData) => {
      console.log(markerData);
    });
    return () => {
      newMarker$.unsubscribe();
    };
  }, [newMarker$]);

  useEffect(() => {
    markerDrag$.subscribe((markerData) => {
      console.log(markerData);
    });
    return () => {
      markerDrag$.unsubscribe();
    };
  }, [markerDrag$]);

  return (
    <>
      <div id="coords-tag"></div>
      <div id="map-wrapper" ref={setMapRef}></div>
    </>
  );
};

export default MapView;
