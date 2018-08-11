import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import './App.css';
import PlacesList from './PlacesList'
import GoogleMap from './GoogleMap'
import Toggle from './Toggle'

class NeighborhoodApp extends Component {
// Add state as class property outside contructor
  state = {
    locations: [],
    isListOpen: false,
    filterQuery: ''
  }

  /**
   * This is a lifecycle hook which runs immediate after the component
   * output has been rendered to the DOM.
   */
  componentDidMount() {
    let locations = [
                {
                  title: 'Amer Fort, Jaipur',
                  latlng: {lat: 26.996471, lng: 75.876472}
                },
                {
                  title: 'Ajmer, Jaipur',
                  latlng: {lat: 26.449896, lng: 74.639915}
                },
                {
                  title: 'Jodhpur, Rajasthan',
                  latlng: {lat: 26.263863, lng: 73.008957}
                },
                {
                  title: 'Pushkar, Rajasthan',
                  latlng: {lat: 26.489679, lng: 74.550941}
                },
                {
                  title: 'Jaipur, Rajasthan',
                  latlng: {lat: 26.922070, lng: 75.778885}
                }
                ];
      this.setState({ locations });
  }

  showListView = () =>{
    this.setState(prevState => ({
      isListOpen: !prevState.isListOpen
    }));
  }

  updateQuery = (filterQuery) => {
    this.setState({ filterQuery });
  }

  render() {
    const { locations, isListOpen, filterQuery } = this.state;
    let filteredLocations;
    if(filterQuery.trim()){
      const match = new RegExp(escapeRegExp(filterQuery),'i');
      filteredLocations = locations.filter( location => match.test(location.title) );
    }else {
      filteredLocations = locations;
    }

    return (
      <div className="App">
        <header>
          <h1>Tourist Places in India</h1>
          <Toggle showPlaceList={this.showListView}/>
        </header>
        <div id="placelistview" className={isListOpen ? 'listview open' : 'listview' }>
          <div id="filter">
              <input
                id="filter-text"
                type="text"
                placeholder="Search places by name"
                value={filterQuery}
                onChange={(event) => {this.updateQuery(event.target.value);}}
              />
          </div>
          <PlacesList locations={filteredLocations}/>
        </div>
        <GoogleMap locations={filteredLocations} filterText={filterQuery}/>
      </div>
    );
  }
}

export default NeighborhoodApp;
