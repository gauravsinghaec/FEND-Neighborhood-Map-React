import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Filter extends Component {
  // Add PropTypes validation
  static propTypes = {
    updateQuery: PropTypes.func.isRequired,
  }

  // App's internal state
  state = {
    inputValue: '',
  }

  updateInput = (inputValue) => {
    this.setState({ inputValue });
  }

  render() {
    const { inputValue } = this.state;
    const { updateQuery } = this.props;
    return (
      <div id="filter">
        {/* Input element to serch or filter places from the listing  */}
        <label htmlFor="filter-text">
          <input
            id="filter-text"
            type="text"
            placeholder="Search places by name"
            value={inputValue}
            onChange={(event) => {
              this.updateInput(event.target.value);
              updateQuery(event.target.value);
            }}
          />
          <span id="filter-help">
            Filter
          </span>
        </label>
      </div>
    );
  }
}

export default Filter;
