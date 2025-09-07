import React from 'react';
import { useState } from 'react';
import './InfoForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const InfoForm = ({
  setIsFormOpen,
  refreshPerson,
  onSubmitSuccess,
  onLocationAdded,
}) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [reportee, setReportee] = useState('');
  const [relationship, setRelationship] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    //send data to a server of the form information
    const formData = {
      name,
      number,
      reportee,
      relationship,
      selectedDate,
      street,
      city,
      description,
      // address: `${street}, ${city}`,
    };
    const address = `${street}, ${city}`;
    try {
      const response = await axios.post('http://localhost:3000/geocode', {
        formData,
        address,
      });

      if (refreshPerson) {
        await refreshPerson();
      }
      if (onSubmitSuccess) {
        onSubmitSuccess(); // This will update the refreshKey
      }
      const coordinates = response.data.coordinates;
      if (coordinates && onLocationAdded) {
        onLocationAdded(coordinates);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error appropriately - maybe show user feedback
    }
  };
  return (
    <div className='forminput'>
      <h1>Report Missing Person</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-grid'>
          <div className='upload-box'>Click to upload photo</div>
          <div className='right-input'>
            <input
              type='text'
              placeholder='Missing Person Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Contact Number'
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              type='text'
              placeholder='Reported By'
              value={reportee}
              onChange={(e) => setReportee(e.target.value)}
            />
            <input
              type='text'
              placeholder='Relation to Reporter'
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            />
            <DatePicker
              className='date-input'
              dateFormat='MM/dd/yyyy'
              placeholderText='Date'
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />

            <div className='address-row'>
              <input
                type='text'
                placeholder='Street'
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <input
                type='text'
                placeholder='City'
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
        </div>
        <textarea
          type='text'
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className='form-buttons'>
          <button type='submit'>Submit</button>
          <button type='button' onClick={() => setIsFormOpen(false)}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

//name, number,
export default InfoForm;
