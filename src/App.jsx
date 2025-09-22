import { useState, useEffect } from 'react';
import InfoForm from './Components/InfoForm';
import axios from 'axios';
import './App.css';
import MapBoxComponent from './Components/MapBox';
import PopupCard from './Components/PopupCard';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [persons, setPersons] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [flyToCoordinates, setFlyToCoordinates] = useState(null);
  //a state to remember which person was clicked:
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleLocationAdded = (coordinates) => {
    setFlyToCoordinates(coordinates);
    setTimeout(() => setFlyToCoordinates(null), 2000);
  };
  const handleFormSubmit = () => {
    setRefreshKey((prev) => prev + 1);
    setIsFormOpen(false);
  };
  const handleform = () => {
    setIsFormOpen(true);
  };
  const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

  const fetchPersons = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getAllPersons`);
      setPersons(res.data.persons);
    } catch (err) {
      console.error('Error fetching persons', err);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);
  useEffect(() => {
    if (selectedPerson) {
      document.body.style.overflow = 'hidden'; // disable background scroll
    } else {
      document.body.style.overflow = 'auto'; // re-enable scroll
    }
  }, [selectedPerson]);
  return (
    <>
      <div className='mp-btn'>
        <button onClick={handleform}>Report Missing Person</button>
      </div>

      {isFormOpen && (
        <div className='form-backdrop'>
          <div onClick={(e) => e.stopPropagation()}>
            <InfoForm
              setIsFormOpen={setIsFormOpen}
              refreshPerson={fetchPersons}
              onSubmitSuccess={handleFormSubmit}
              onLocationAdded={handleLocationAdded}
            />
          </div>
        </div>
      )}
      {/* Show the list */}
      {/* <ul>
        {persons.map((p) => (
          <li key={p._id}>
            {p.name} — {p.address?.city}
          </li>
        ))}
      </ul> */}
      <MapBoxComponent
        refreshKey={refreshKey}
        flyToCoordinates={flyToCoordinates}
        onPersonSelected={setSelectedPerson}
      />
      {selectedPerson && (
        <div className='popup-wrapper'>
          <PopupCard
            formData={selectedPerson}
            onClose={() => setSelectedPerson(null)}
            onDeleted={() => setRefreshKey((prev) => prev + 1)}
          />
        </div>
      )}
    </>
  );
}

export default App;
