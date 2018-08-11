import React from 'react';
import PropTypes from 'prop-types';

const PlacesList = ({locations}) => (
      <ul id="places-list">
      {locations.map(location => (
        <li key={location.title}><button>{location.title}</button></li>
      ))}
      </ul>
);

// Add PropTypes validation
PlacesList.propTypes = {
  locations: PropTypes.instanceOf(Array).isRequired,
};

export default PlacesList;