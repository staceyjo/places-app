import React from 'react';

import './Card.css';

// This is a presentational component, one of the 2 types of components in React. The other is stateful
// presentational components are like dummy components- just rendering the styling, gets data from outside

const Card = props => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
