// PopupCard.jsx
import React from 'react';

const PopupCard = ({ formData, onClose, onDeleted }) => {
  if (!formData) return null;

  const {
    name,
    number,
    reportee,
    _id,
    selectedDate,
    street,
    city,
    description,
    address,
  } = formData;
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleFoundPerson = async () => {
    const name = prompt('Please enter name of the person who reported');
    if (!name) return;
    if (name) {
      console.log('Reportee Name:', name);
    }
    if (reportee === name) {
      try {
        const response = await fetch(`${API_BASE}/person/${_id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Network response not ok');
        }
        const data = await response.json();
        console.log('Deleted:', data);
        alert('This person has been found successfully');
        onClose();
        if (onDeleted) onDeleted();
      } catch (err) {
        console.error('Error deleting person:', err);
      }
    } else {
      alert('Reportee name does not match!');
    }
  };
  return (
    <div className='popup-overlay'>
      <div className='popup-card'>
        <button className='close-btn' onClick={onClose}>
          ×
        </button>
        <div className='popup-details'>
          {name && (
            <div>
              <strong>Name:</strong>
              {name}
            </div>
          )}
          {description && (
            <div>
              <strong>Description:</strong>
              {description}
            </div>
          )}

          {number && (
            <div>
              <strong>Contact:</strong> {number}
            </div>
          )}

          {(street || city || address?.city) && (
            <div>
              <strong>Last Seen:</strong>{' '}
              {[street, city || address?.city].filter(Boolean).join(', ')}
            </div>
          )}
          {selectedDate && (
            <div>
              <strong>Date:</strong>{' '}
              {new Date(selectedDate).toLocaleDateString()}
            </div>
          )}
        </div>
        <div>
          <button className='found-btn' onClick={handleFoundPerson}>
            Mark as found
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupCard;
