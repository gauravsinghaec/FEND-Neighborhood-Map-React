import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import './App.css';
import PlacesList from './PlacesList';
import GoogleMap from './GoogleMap';
import Toggle from './Toggle';

class NeighborhoodApp extends Component {
// Add state as class property outside contructor
  state = {
    locations: [],
    isListOpen: false,
    filterQuery: '',
    selectedPlaceTitle: '',
  }

  /**
   * This is a lifecycle hook which runs immediate after the component
   * output has been rendered to the DOM.
   */
  componentDidMount() {
    fetch('https://api.foursquare.com/v2/venues/search?ll=22.5726,88.3639&client_id=URF15OGCPJ1TLULVBABNIUQ0Z4DG0V0MG4M30CXCZHJCGTES&client_secret=14SK5TBI4RESQ4C4NWDQOYT03L3K0YE5025BMRPEYTEOHQJN&limit=25&v=20180707')
      .then(response => response.json())
      .then((data) => {
        const locations = data.response.venues;
        this.setState({ locations });
      })
      .catch(error => console.log(error));
  }

  showListView = () => {
    this.setState(prevState => ({
      isListOpen: !prevState.isListOpen,
    }));
  }

  updateQuery = (filterQuery) => {
    this.setState({ filterQuery });
  }

  selectPlace = (selectedPlaceTitle) => {
    this.setState({ selectedPlaceTitle });
  }

  render() {
    const { locations, isListOpen, filterQuery, selectedPlaceTitle } = this.state;
    let filteredLocations;
    if (filterQuery.trim()) {
      const match = new RegExp(escapeRegExp(filterQuery), 'i');
      filteredLocations = locations.filter(location => match.test(location.name));
    } else {
      filteredLocations = locations;
    }

    return (
      <div className="App">
        <header>
          <h1>
            Places in Kolkata
          </h1>
          <Toggle showPlaceList={this.showListView} />
        </header>
        <section id="placelistview" className={isListOpen ? 'listview open' : 'listview'}>
          <div id="filter">
            <label htmlFor="filter-text">
              <input
                id="filter-text"
                type="text"
                placeholder="Search places by name"
                value={filterQuery}
                onChange={(event) => { this.updateQuery(event.target.value); }}
              />
              <span id="filter-help">Filter</span>
            </label>
          </div>
          <PlacesList
            locations={filteredLocations}
            selectPlace={this.selectPlace}
          />
        </section>
        <GoogleMap
          locations={filteredLocations}
          filterText={filterQuery}
          selectedPlaceTitle={selectedPlaceTitle}
        />
      </div>
    );
  }
}

export default NeighborhoodApp;
