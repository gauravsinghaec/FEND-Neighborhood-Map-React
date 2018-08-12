import React from 'react';
import PropTypes from 'prop-types';

const PlacesList = ({ locations, selectPlace }) => (
  <ul id="places-list">
    {locations.map(location => (
      <li key={location.id}>
        <button type="button" onClick={(event) => { selectPlace(event.target.innerText); }}>
          {location.name}
        </button>
      </li>
    ))}
  </ul>
);

// Add PropTypes validation
PlacesList.propTypes = {
  locations: PropTypes.instanceOf(Array).isRequired,
  selectPlace: PropTypes.func.isRequired,
};

export default PlacesList;
