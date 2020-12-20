import useClientLogic from "../hooks/useClientLogic";

const MapView = () => {
  const { coords, setMapRef } = useClientLogic();

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
