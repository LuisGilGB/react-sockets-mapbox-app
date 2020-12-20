import React, { useCallback, useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import useMapbox from "../hooks/useMapbox";

const MapView = () => {
  const { socket } = useContext(SocketContext);
  const { newMarker$, markerDrag$, setMapRef, updateMarkers } = useMapbox();

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
    newMarker$.subscribe(emitAddMarker);
    return () => {
      newMarker$.unsubscribe();
    };
  }, [newMarker$, emitAddMarker]);

  useEffect(() => {
    markerDrag$.subscribe(emitUpdateMarker);
    return () => {
      markerDrag$.unsubscribe();
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
      <div id="coords-tag"></div>
      <div id="map-wrapper" ref={setMapRef}></div>
    </>
  );
};

export default MapView;
