// import React from 'react';
// import { useEffect, useState, useRef } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import './Map.css';
// import PopUpContents from './PopUpContents';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix Leaflet's default icon paths
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });
// const MapComponent = ({ peopleData, getMissingPersonsData }) => {
//   const [mapInstance, setMapInstance] = useState(null);
//   const [selectedPerson, setSelectedPerson] = useState(null);

//   useEffect(() => {
//     const map = new L.Map('map');
//     var ca = new L.LatLng(34.0208782, -118.4233876);
//     map.setView(ca, 13);
//     L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution:
//         '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
//       maxZoom: 18,
//     }).addTo(map);
//     map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
//     setMapInstance(map);
//     return () => map.remove();
//   }, []);
//   const markersRef = useRef({});
//   useEffect(() => {
//     //Loop through the markers array
//     if (mapInstance && peopleData) {
//       // Get current IDs in data
//       const currentIds = peopleData.map((p) => p._id);

//       // Remove markers for people who are no longer in peopleData
//       Object.keys(markersRef.current).forEach((id) => {
//         if (!currentIds.includes(id)) {
//           mapInstance.removeLayer(markersRef.current[id]);
//           delete markersRef.current[id];
//         }
//       });
//       for (let i = 0; i < peopleData.length; i++) {
//         const person = peopleData[i];

//         console.log('Person location structure:', person.location);
//         console.log('Person coordinates:', person.location?.coordinates);
//         console.log('Coordinates type:', typeof person.location?.coordinates);

//         // Validate location data exists
//         if (!person.location || !person.location.coordinates) {
//           console.warn(
//             'Skipping marker: No location data for person',
//             person.name
//           );
//           continue;
//         }

//         let coords = person.location?.coordinates;
//         if (!coords || !Array.isArray(coords)) {
//           console.warn('Skipping marker: No coordinates for person', person);
//           continue;
//         }
//         coords = coords.map(Number);
//         if (coords.some((c) => Number.isNaN(c))) {
//           console.warn(
//             'Skipping marker: NaN coordinates for person',
//             person.name
//           );
//           continue;
//         }
//         const [lon, lat] = coords;

//         console.log('Placing marker at:', { lat, lon });

//         const popupText = person.name;
//         const markerLocation = new L.LatLng(lat, lon);
//         const marker = new L.Marker(markerLocation);
//         marker.bindPopup(popupText);
//         // mapInstance.addLayer(marker);
//         marker.on('click', () => {
//           console.log('Clicked:', person.name);
//           setSelectedPerson(person);
//         });

//         marker.addTo(mapInstance);
//         mapInstance.flyTo(markerLocation, 15);
//         markersRef.current[person._id] = marker;
//       }
//     }
//   }, [mapInstance, peopleData]);
//   // useEffect(() => {
//   //   console.log('Selected person changed:', selectedPerson);
//   // }, [selectedPerson]);

//   // };

//   return (
//     <div>
//       <div id='map'></div>
//       {selectedPerson && (
//         <PopUpContents
//           person={selectedPerson}
//           onClose={() => setSelectedPerson(null)}
//           getMissingPersonsData={getMissingPersonsData}
//         />
//       )}
//     </div>
//   );
// };

// export default MapComponent;
