import React from 'react';

const cardStyle = {
  marginTop: '2rem',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  backgroundColor: '#3b4049',
};

const ResultCard = ({ data }) => {
  if (!data) return null;
  return (
    <div style={cardStyle}>
      <h3>Category: {data.category}</h3>
      <p>{data.disposalTips}</p>
    </div>
  );
};

export default ResultCard;