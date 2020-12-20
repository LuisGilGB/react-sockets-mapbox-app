import { useCallback, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Subject } from "rxjs";
import { v4 as uuidV4 } from "uuid";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const useMapbox = (startingLat = 39, startingLng = -6.4, startingZoom = 10) => {
  // Refs
  const map = useRef();
  const mapBoxDiv = useRef();
  const markers = useRef({});

  // Observables
  const newMarker = useRef(new Subject());
  const markerDrag = useRef(new Subject());

  // Callbacks
  const setMapRef = useCallback((node) => {
    mapBoxDiv.current = node;
  }, []);

  const addMarker = useCallback(({ id, lat, lng }) => {
    const marker = new mapboxgl.Marker({ draggable: true });
    marker.id = id ?? uuidV4();
    marker.setLngLat([lng, lat]).addTo(map.current);

    markers.current[marker.id] = marker;

    marker.on("drag", ({ target }) => {
      const { id } = target;
      const { lat, lng } = target.getLngLat();

      markerDrag.current.next({
        id,
        lat,
        lng,
      });
    });

    newMarker.current.next({
      id: marker.id,
      lat,
      lng,
    });
  }, []);

  useEffect(() => {
    const mapboxInstance = new mapboxgl.Map({
      container: mapBoxDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [startingLng, startingLat],
      zoom: startingZoom,
    });

    map.current = mapboxInstance;
  }, [startingLat, startingLng, startingZoom]);

  useEffect(() => {
    map.current?.on("click", (ev) => {
      const { lat, lng } = ev?.lngLat;
      addMarker({ lat, lng });
    });
    return () => {
      map.current?.off("click");
    };
  }, [addMarker]);

  return {
    markers,
    newMarker$: newMarker.current,
    markerDrag$: markerDrag.current,
    setMapRef,
    addMarker,
  };
};

export default useMapbox;
