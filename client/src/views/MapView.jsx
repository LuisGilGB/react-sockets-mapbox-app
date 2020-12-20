import React, { useCallback, useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import useMapbox from "../hooks/useMapbox";

const INITIAL_SPOT = {
  lat: 38.92,
  lng: -6.35,
  zoom: 12,
};

const MapView = () => {
  const { socket } = useContext(SocketContext);
  const {
    coords,
    newMarker$,
    markerDrag$,
    setMapRef,
    updateMarkers,
  } = useMapbox(INITIAL_SPOT);

  const emitAddMarker = useCallback(
    (markerData) => {
      socket.emit("add-marker", {
        payload: { ...markerData },
      });
    },
    [socket]
  );

  const emitUpdateMarker = useCallback(
    (markerData) => {
      socket.emit("update-marker", {
        payload: { ...markerData },
      });
    },
    [socket]
  );

  useEffect(() => {
    const subscription = newMarker$.subscribe(emitAddMarker);
    return () => {
      subscription.unsubscribe();
    };
  }, [newMarker$, emitAddMarker]);

  useEffect(() => {
    const subscription = markerDrag$.subscribe(emitUpdateMarker);
    return () => {
      subscription.unsubscribe();
    };
  }, [markerDrag$, emitUpdateMarker]);

  useEffect(() => {
    socket.on("server-update", ({ payload }) => {
      updateMarkers(payload);
    });
    return () => {
      socket.off("server-update");
    };
  }, [socket, updateMarkers]);

  return (
    <>
      <div id="coords-tag">
        Lat: {coords.lat} | Lng: {coords.lng}
      </div>
      <div id="map-wrapper" ref={setMapRef}></div>
    </>
  );
};

export default MapView;
