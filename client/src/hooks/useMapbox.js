import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Subject } from "rxjs";
import { v4 as uuidV4 } from "uuid";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const useMapbox = ({
  lat: startingLat,
  lng: startingLng,
  zoom: startingZoom,
}) => {
  const [coords, setCoords] = useState({
    lat: startingLat,
    lng: startingLng,
    zoom: startingZoom,
  });
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

    if (!id) {
      newMarker.current.next({
        id: marker.id,
        lat,
        lng,
      });
    }
  }, []);

  const updateMarkers = useCallback(
    (payload = {}) => {
      const newMarkers = payload.markers;
      for (const key in markers.current) {
        if (!newMarkers[key]) {
          markers.current[key].remove();
          delete markers.current[key];
        }
      }
      for (const key in newMarkers) {
        const marker = newMarkers[key];
        if (markers.current[key]) {
          markers.current[key].setLngLat([marker.lng, marker.lat]);
        } else {
          addMarker(marker);
        }
      }
    },
    [addMarker]
  );

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
    map.current?.on("move", () => {
      const { lng, lat } = map.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2),
      });
    });
    return () => {
      map.current?.off("unsubscribe");
    };
  }, []);

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
    coords,
    markers,
    newMarker$: newMarker.current,
    markerDrag$: markerDrag.current,
    setMapRef,
    addMarker,
    updateMarkers,
  };
};

export default useMapbox;
