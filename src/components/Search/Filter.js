import React from 'react';
import PropTypes from 'prop-types';

const Filter = ({ updateQuery, filterQuery }) => (
  <div id="filter">
    {/* Input element to serch or filter places from the listing  */}
    <label htmlFor="filter-text">
      <input
        id="filter-text"
        type="text"
        placeholder="Search places by name"
        value={filterQuery}
        onChange={(event) => { updateQuery(event.target.value); }}
      />
      <span id="filter-help">
        Filter
      </span>
    </label>
  </div>
);

// Add PropTypes validation
Filter.propTypes = {
  updateQuery: PropTypes.func.isRequired,
  filterQuery: PropTypes.string.isRequired,
};

export default Filter;
