import React, { Component } from 'react';
import PropTypes from 'prop-types'

class GoogleMap extends Component {
  static propTypes = {
    locations: PropTypes.instanceOf(Array).isRequired,
    filterText: PropTypes.string.isRequired,
  }

  constructor(props){
    super(props)
    this.state = {
      map: null,
      largeInfowindow: null,
      markers: []
    }
    /**
     ** Use createRef() to create a reference to the DOM node we want
     ** Learn more about Refs for React here: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
     */
    this.myMapContainer = React.createRef()
  }

  // Filter Map markers for places.
  filterMarkerOnMap = (filterText) => {
    const { map, markers } = this.state;
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].title.indexOf(filterText) != -1) {
        markers[i].setMap(map);
      } else {
        markers[i].setMap(null);
      }
    }
  }


  // Map markers for places.
   static mapMarkerToMap(place, map) {
    const marker = new window.google.maps.Marker({
      map: map,
      position: {lat: place.location.lat, lng: place.location.lng},
      title: place.name,
      animation: window.google.maps.Animation.DROP,
      id: 1
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
    if (infowindow.marker !== marker) {
      if(infowindow.marker){
        infowindow.marker.setAnimation(null);
      }
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.marker = null;
        marker.setAnimation(null);
      });

      GoogleMap.ajaxCallForWikiData(marker, infowindow);

    }
  };

  /**
   * This function is used to make AJAX call to Wiki API and populate infowindow with data
   * also it shows error message in infowindow if API call fails
   */
  static ajaxCallForWikiData = (marker, infowindow) => {
    let address = marker.title;
    let wikiurl = `https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${address}`;
    let wikiElemItem ='';

    //AJAX call to retrieve data from Wikipedia
    fetch(wikiurl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      for (var i=0;i<data.length;i++)    {
        wikiElemItem += data[i].length ?
                        `<li>
                            <a target ="_blank" href=http://en.wikipedia.org/wiki/${data[i]}>
                              ${data[i]}
                            </a>
                        </li>`
                        : '' ;
      }
      infowindow.setContent(`<h5>Relevant Wikipedia Links</h5>${wikiElemItem}`);
    }).catch(function() {
      infowindow.setContent(`<div>${marker.title}</div> <div>No Wiki Link Found</div>`);
    });
  };

  componentDidMount() {
    window.initMap = this.initMap;
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
        this.initMap()
    } else {
        this.loadGoogleMapAPIJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyBtsirN68OAeo4fv8o0iEOZ5dJlEAHLUxA&callback=initMap')
    }
  }

  componentDidUpdate() {
    this.filterMarkerOnMap(this.props.filterText);
  }

  // Load Google APIS
  loadGoogleMapAPIJS = (src) => {
      let ref = window.document.getElementsByTagName("script")[0];
      let script = window.document.createElement("script");
      script.src = src;
      script.async = true;
      ref.parentNode.insertBefore(script, ref);
  }

  initMap = () => {
      const map = new window.google.maps.Map(this.myMapContainer.current, {
        center: {lat: 26.996471, lng: 75.876472},
        zoom: 6
      })
      const largeInfowindow = new window.google.maps.InfoWindow();
      this.setState({map, largeInfowindow});
      this.loadMarkersOnMap();
  }

  loadMarkersOnMap = () => {
    const { map, largeInfowindow, markers } = this.state;
    const bounds = new window.google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (const place of this.props.locations) {
      // Create a marker per location, and put into markers array.
      let marker = GoogleMap.mapMarkerToMap(place,map);
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function(){
        return function(){
          GoogleMap.populateInfoWindow(map, marker, largeInfowindow)
        }(marker);
      });
      bounds.extend(marker.position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
  }
  render() {
    return (
    <div id="maptab">
      <div ref={this.myMapContainer} id="map"></div>
      <div id="map-error" hidden>
        <p>
          Google Maps now requires the use of a valid API Key.
          That's why you see the popup window "This page can't load Google Maps correctly."
        </p>
        <a href="https://developers.google.com/maps/documentation/javascript/get-api-key">
          Go get one!
        </a>
      </div>
    </div>
    )
  }
}

export default GoogleMap;