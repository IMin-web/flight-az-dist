import { useState, useEffect } from "react";
import React from "react";
import './App.css'
import ReactMapGL, { Marker} from 'react-map-gl';
import { ReactComponent as Airplane } from './marker.svg';
import Radar from './Radar'
import locate from "./locate";

function App() {
  const [locBase, setLocBase] = useState([])
  const [markerOn, setMarkerOn] = useState(false)
  let markerStyle = {'fill' : 'red'}
  let table = React.createRef()
  let marker = React.createRef()

  function clickHandler(event) {
    
    console.log(document.getElementsByClassName('mapboxgl-marker'))
    console.log(event.target.innerHTML)
  }

  useEffect(() => {
    locate()
    .then(res => setLocBase(res))
  });
  
  const [viewport, setViewport] = React.useState({  //Карта
    latitude: 0,
    longitude: 0,
    zoom: 5.8,
    mapboxApiAccessToken: 'pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA',
  });

  return (
      <div className="radar">
        <div className="position">
          <ReactMapGL id="666" {...viewport} width="100%" height="100%" mapStyle='mapbox://styles/mapbox/streets-v11' onViewportChange={(viewport) => setViewport(viewport)}>
            {locBase.map(item => (<Marker key={item[0]} latitude={item[2]} longitude={item[3]} title={item[0]}>
              <Airplane key={item[0]}/>
            </Marker>))}
          </ReactMapGL>
          <Radar/>
        </div>
        <div className="table">
          {locBase.map(item => (
            <div key={item[0]} onClick={clickHandler} >
                  <h1>{item[14] || 'Без названия'}</h1>
                  <p>Высота: {(Math.round((item[5]) / 0.33)) / 10}</p>
                  <p>Скорость: {Math.round((item[6]) * 1.87)}</p>
                  <p>Курс: {item[4]}</p>
            </div>
          ))}
        </div>
      </div>
  );
}
export default App;
