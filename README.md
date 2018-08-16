# Neighborhood Map React Project
This project is developed using Google Map API and React. The initial location data (to load onto the map)
is being fetched from [Foursquare third party API](#thirt-party-apis). You can filter the location from
the text filter section and the map markers & place listings will be updated on real-time based on the
input text. Also you will be able to get the details about each place by selecting the place from the
listing or by clicking on the individual map markers.

## Table of Contents

- [Getting Started](#getting-started)
- [Project URL](#project-url)
- [Create React App](#create-react-app)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [How to launch the app locally](#how-to-launch-the-app-locally)
  - [Installation](#installation)
- [Deploy to gh-pages](#deploy-to-gh-pages)
- [Offline Use and Service Worker](#offline-use-and-service-worker)
- [Thirt Party APIs](#thirt-party-apis)
- [Resources](#resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Getting Started

You need to set up the application before you can see it running live in your browser.
Please check the [installation](#how-to-launch-the-app-locally) section to know more.

## Project URL

- https://gauravsinghaec.github.io/FEND-Neighborhood-Map-React/

![image](https://user-images.githubusercontent.com/15084301/44168788-00c05500-a0f0-11e8-8170-f67c4426d36a.png)

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Folder Structure
Your project folder should look like this:
```
├── README.md - This file.
├── package.json # npm package manager file. It's unlikely that you'll need to modify this.
├── .eslintrc.json # eslint configuration settings
├── public
│   ├── favicon.ico # React Icon,
│   └── index.html # DO NOT MODIFY
├── build It contains the production ready code
└── src
    ├── App.css # Styles for your app.
    ├── App.js # This is the root of the app.
    ├── GoogleMap.js # React Map component
    ├── PlaceList.js # React place list component
    ├── Toggle.js # A React component for hamburger menu
    ├── registerServiceWorker.js # registers service worker in production environment
    ├── index.css # Global styles.
    └── index.js # It is used for DOM rendering only.
```

## Prerequisites
* ES6, Promises, REACT, Service Worker, A11y

## How to launch the app locally?

### Installation

1. Clone the Project - `https://github.com/gauravsinghaec/FEND-Neighborhood-Map-React.git`
2. Go into the directory where the project now lives - `cd FEND-Neighborhood-Map-React`
3. Install the dependencies - `npm install`
4. Start the app - `npm start`
```
The application will be running at http://localhost:8000 URL
```

## Deploy to gh-pages
1. Add the following scripts in your package.json and also add the "homepage":<your to be created github page>

  "homepage": "https://<github-username>.github.io/<gitHubRepo>",

  "scripts": {
  +  "predeploy": "npm run build",
  +  "deploy": "gh-pages -d build",
  }

2. Install the gh-pages module to create gh-pages branch on github during deployment.
```
>>>npm install --save gh-pages
```

3. Deploy the app - Below command is used to deploy the React app to the gh-pages but before that we need few pre-requisite.
```
>>>npm run deploy
```
![image](https://user-images.githubusercontent.com/15084301/44168243-3b28f280-a0ee-11e8-9c88-5cd1d29786b5.png)

4. Now there will be a new branch in your GitHub repo "gh-pages" where the build files will be present and
do check the gh-pages section in GitHub repo setting to see the hosted URL.

![image](https://user-images.githubusercontent.com/15084301/44169010-bd1a1b00-a0f0-11e8-9486-2a6fc699ef4a.png)

* You can get all the info about [deployment here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment). Also don't forget to check the [Resources](#resources) below.

## Offline Use and Service Worker
By default, the create-react-app includes a service worker in the production build.
Do check the below steps to see service worker in action after production build

1. Build the app to generate production version and test.
```
npm run build
```
![image](https://user-images.githubusercontent.com/15084301/44098194-263b81b8-9ffd-11e8-8139-e34a570c1f85.png)

2. Now the build folder will look like below:
![image](https://user-images.githubusercontent.com/15084301/44098201-2949f006-9ffd-11e8-81d5-dcf581a0fc46.png)

3. Static Server - Set up your favorite HTTP server so that a visitor to your site is served index.html.
   For environments using Node, the easiest way to handle this would be to install `serve` and let it handle the rest:
```
>>>npm install –g serve
>>>serve –s build
```
![image](https://user-images.githubusercontent.com/15084301/44098236-4268837c-9ffd-11e8-8ea8-5cae0b12afaa.png)

4. Service Worker running in the browser.
![image](https://user-images.githubusercontent.com/15084301/44098243-456b04a0-9ffd-11e8-8f7a-25ececc73442.png)

5. Service Worker caching main.{hash}.js, main.{hash}.js and index.html for offline access.
![image](https://user-images.githubusercontent.com/15084301/44098244-49f91354-9ffd-11e8-97b4-431388f85dea.png)


## Thirt Party APIs
* Foursquare API
	We are loading the neighbouring locations for a given place (using its lattitude, longitude)
	from this API. The places received are shown in the place listing and hence on the Map.
```
Foursquare fetch API url
"https://api.foursquare.com/v2/venues/search?ll=22.5726,88.3639&client_id=<YOUR_CLIENT_ID>&client_secret=<YOUR_CLIENT_SECRET>&limit=25&v=20180707"

Here I am using Kolkata Coordinate 22.5726° N, 88.3639° E to get the neighboring locations
```

* Wiki API
	We are fetching the wiki data from this API about each place and hence showing in the infowindow
	when marker is clicked on the map.
```
Wiki fetch API url
"https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=Belgium&limit=5"
```

## Resources
- [Google Maps JavaScript API V3 Reference](https://developers.google.com/maps/documentation/javascript/reference)
- [Google Maps Markers](https://developers.google.com/maps/documentation/javascript/markers)
- [Google Maps Infowindow](https://developers.google.com/maps/documentation/javascript/infowindows)
- [All aria-* attribute](https://www.w3.org/TR/wai-aria-1.1/#state_prop_def)
- [WebAIM Checklist for Accessibility](https://webaim.org/standards/wcag/checklist#sc1.4.6)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MediaWiki API help](https://en.wikipedia.org/w/api.php)
- [Foursquare API endpoints](https://developer.foursquare.com/docs/api/endpoints)
- [Google Map and React](https://stackoverflow.com/questions/34779489/rendering-a-google-map-without-react-google-map)
- [React componentDidUpdate lifecycle event](https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops)
- [Writing Scalable React Apps with the Component Folder Pattern](https://medium.com/styled-components/component-folder-pattern-ee42df37ec68)
- [Throttle and Debounce used for input field](https://lodash.com/docs/4.17.10#debounce)
- [react-throttle](https://github.com/gmcquistin/react-throttle)
- [Refs in React](https://reactjs.org/docs/refs-and-the-dom.html)

## Authors
* **Gaurav Singh**

## Acknowledgments
* **Special thanks to Udacity Team**
