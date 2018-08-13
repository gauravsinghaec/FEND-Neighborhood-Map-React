import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import PropTypes from 'prop-types';

class GoogleMap extends Component {
  // Map markers for places.
  static mapMarkerToMap(place, map, i) {
    const label = place.name[0];
    const marker = new window.google.maps.Marker({
      // Use property shorthand of ES6 syntax in place of map: map,
      map,
      position: { lat: place.location.lat, lng: place.location.lng },
      title: place.name,
      animation: window.google.maps.Animation.DROP,
      id: i,
      label,
    });
    return marker;
  }

  /**
   * This function populates the infowindow when the marker is clicked. We'll only allow
   * one infowindow which will open at the marker that is clicked, and populate based
   * on that markers position.
   */
  static populateInfoWindow = (map, marker, infowindow) => {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.getPosition() !== marker.position) {
      if (infowindow.marker) {
        infowindow.marker.setAnimation(null);
      }
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      infowindow.marker = marker;
      infowindow.setContent(`<div>${marker.title}</div>`);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', () => {
        infowindow.setPosition(null);
        marker.setAnimation(null);
      });
      GoogleMap.fetchWikiData(marker, infowindow);
    }
  };

  /**
   * This function is used to make AJAX call to Wiki API and populate infowindow with data
   * also it shows error message in infowindow if API call fails
   */
  static fetchWikiData = (marker, infowindow) => {
    const address = marker.title;
    const wikiurl = `https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${address}`;
    let wikiElemItem = `<div class="infowindow"><h2>${address}</h2>
      <p>Relevant Wikipedia Links</p>
    <ul>`;

    // AJAX call to retrieve data from Wikipedia
    fetch(wikiurl)
      .then(response => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i += 1) {
          wikiElemItem += data[i].length
            ? `<li class="infowindow-item">
                <a target ="_blank" href=http://en.wikipedia.org/wiki/${data[i]}>
                  ${data[i]}
                </a>
            </li>`
            : '';
        }
        wikiElemItem += '</ul></div>';
        infowindow.setContent(wikiElemItem);
      }).catch(() => {
        infowindow.setContent(`<div>${marker.title}</div> <div>No Wiki Link Found</div>`);
      });
  };

  static propTypes = {
    locations: PropTypes.instanceOf(Array).isRequired,
    filterText: PropTypes.string.isRequired,
    selectedPlaceTitle: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      map: null,
      largeInfowindow: null,
      markers: [],
    };
    /**
     ** Use createRef() to create a reference to the DOM node we want
     */
    this.myMapContainer = React.createRef();
  }

  componentDidMount() {
    window.initMap = this.initMap;
    window.googleError = this.googleError;
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
      this.initMap();
    } else {
      this.loadGoogleMapAPIJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyBtsirN68OAeo4fv8o0iEOZ5dJlEAHLUxA&callback=initMap');
    }
  }

  componentDidUpdate(prevProps) {
    const { filterText, selectedPlaceTitle } = this.props;
    if (filterText !== prevProps.filterText) {
      this.setState({ markers: this.filterMarkerOnMap(filterText) });
    }
    if (selectedPlaceTitle !== prevProps.selectedPlaceTitle) {
      this.setState({ markers: this.animateSelectedPlaceOnMap(selectedPlaceTitle) });
    }
  }

  googleError = () => {
    let content = window.document.getElementById('map-error');
    content.hidden = false;
    window.document.getElementById('map').appendChild(content);
  }

  // Funtion to filter only the selected place from location list
  animateSelectedPlaceOnMap = (placeTitle) => {
    const { map, markers, largeInfowindow } = this.state;
    for (let i = 0; i < markers.length; i += 1) {
      if (placeTitle === markers[i].title) {
        markers[i].setAnimation(window.google.maps.Animation.BOUNCE);
        GoogleMap.populateInfoWindow(map, markers[i], largeInfowindow);
      } else {
        markers[i].setAnimation(null);
      }
    }
    return markers;
  };

  // Filter Map markers for places.
  filterMarkerOnMap = (filterText) => {
    const { map, markers } = this.state;
    const match = new RegExp(escapeRegExp(filterText), 'i');
    for (let i = 0; i < markers.length; i += 1) {
      if (match.test(markers[i].title)) {
        markers[i].setMap(map);
      } else {
        markers[i].setMap(null);
      }
    }
    return markers;
  }

  // Load Google APIS
  loadGoogleMapAPIJS = (src) => {
    const ref = window.document.getElementsByTagName('script')[0];
    const script = window.document.createElement('script');
    script.src = src;
    script.setAttribute('onerror','googleError()');
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  }

  initMap = () => {
    const map = new window.google.maps.Map(this.myMapContainer.current, {
      center: { lat: 26.996471, lng: 75.876472 },
      zoom: 6,
    });
    const largeInfowindow = new window.google.maps.InfoWindow();
    this.setState({ map, largeInfowindow });
    this.loadMarkersOnMap();
  }

  loadMarkersOnMap = () => {
    const { map, largeInfowindow, markers } = this.state;
    const { locations } = this.props;
    const bounds = new window.google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (let i = 0; i < locations.length; i += 1) {
      // Create a marker per location, and put into markers array.
      const marker = GoogleMap.mapMarkerToMap(locations[i], map, i);
      // Push the marker to our array of markers.
      markers.push(marker);
      /**
       * Create an onclick event to open an infowindow at each marker.
       * Using closure to make marker available in callbacks
       */
      marker.addListener('click', () => (function captureMarker() {
        GoogleMap.populateInfoWindow(map, marker, largeInfowindow);
      }(marker)));
      bounds.extend(marker.position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
  }

  render() {
    return (
      <section id="maptab" role="application">
        <div ref={this.myMapContainer} id="map" aria-label="Places on Map" aria-describedby="map-help" />
        <div id="map-help">
          <p>
            Map showing the places as per the
            <a target="_blank" rel="noopener noreferrer" href="https://developer.foursquare.com/">
              <span> Foursquare API</span>
            </a>
          </p>
        </div>
        <div id="map-error" aria-label="Can not load the Map" hidden>
          <p>
            <span className="error">
              "This page can not load Google Maps correctly."
            </span>
            <br />
            <em>
              Google Map API now requires the use of a valid API Key.
            </em>
            <br />
            <a href="https://developers.google.com/maps/documentation/javascript/get-api-key">
              Go get one!
            </a>
          </p>
        </div>
      </section>
    );
  }
}

export default GoogleMap;
