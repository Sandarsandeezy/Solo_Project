import React from 'react';

const PopupCard = ({ formData }) => {
  //if there is no data return null
  if (!formData) return null;
  return <div>{JSON.stringify(formData, null, 2)}</div>;
};

export default PopupCard;
