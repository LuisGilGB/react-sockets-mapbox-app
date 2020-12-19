import { useCallback, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const useMapbox = () => {
  const mapBoxDiv = useRef();
  const setMapRef = useCallback((node) => {
    mapBoxDiv.current = node;
  }, []);

  const map = useRef();

  useEffect(() => {
    const mapboxInstance = new mapboxgl.Map({
      container: mapBoxDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-6, 39],
      zoom: 8,
    });

    map.current = mapboxInstance;
  }, []);
  return { setMapRef };
};

export default useMapbox;
