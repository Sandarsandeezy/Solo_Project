// // https://api.mapbox.com/search/geocode/v6/forward?q=1234+W+Amy+Ave&access_token

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';
import axios from 'axios';

const MapBoxComponent = ({
  refreshKey,
  flyToCoordinates,
  onPersonSelected,
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const hasLoadedRef = useRef(false); // <-- track first load

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  // init once
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-118.353427, 33.930689],
      zoom: 9,
      projection: 'globe',
    });

    map.on('load', () => {
      hasLoadedRef.current = true; // <-- remember map has loaded at least once
    });

    mapRef.current = map;
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  };

  const addMarkers = (persons) => {
    clearMarkers();
    persons.forEach((person, i) => {
      const coords = person?.location?.coordinates;
      if (Array.isArray(coords) && coords.length === 2) {
        const [lng, lat] = coords;
        console.log('latlng', coords);
        const marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])

          .addTo(mapRef.current);
        marker.getElement().style.cursor = 'pointer';
        marker.getElement().addEventListener('click', () => {
          if (onPersonSelected) onPersonSelected(person);
        });

        markersRef.current.push(marker);
        console.log('Total markers added to map:', markersRef.current.length);
      }
    });
  };

  // fetch + add markers when refreshKey changes
  useEffect(() => {
    const run = async () => {
      if (!mapRef.current) return;

      try {
        const res = await axios.get('http://localhost:3000/getAllPersons');
        const persons = res.data.persons;

        if (hasLoadedRef.current) {
          // map already loaded at least once – add immediately
          addMarkers(persons);
        } else {
          // first time only – wait for that first 'load'
          mapRef.current.once('load', () => addMarkers(persons));
        }
      } catch (e) {
        console.error('Error fetching persons:', e);
      }
    };

    run();
  }, [refreshKey]); // <- works after submit

  // fly to last submitted coords
  useEffect(() => {
    if (!mapRef.current || !flyToCoordinates) return;
    const [lng, lat] = flyToCoordinates;
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 15,
      speed: 1.2,
      essential: true,
    });
  }, [flyToCoordinates]);

  return (
    <div
      ref={mapContainer}
      id='map'
      style={{ width: '100%', height: '100vh' }}
    />
  );
};

export default MapBoxComponent;
