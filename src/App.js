import { useState, useEffect } from "react";
import React from "react";
import './App.css'
import ReactMapGL, { Marker } from 'react-map-gl';
import { ReactComponent as Airplane } from './marker.svg';
import Radar from './Radar'
import locate from "./locate";

function App() {
  const [locBase, setLocBase] = useState([])
  const [clickSelect, setClickSelect] = useState()
  const defaultColor = { 'fill': 'black' }
  const selectColor = { 'fill': 'red' }

  function clickHandler(event) {
    let airplaneName = event.currentTarget
    airplaneName = airplaneName.outerText.slice(0, airplaneName.outerText.indexOf('\n'))
    console.log(airplaneName)
    setClickSelect(airplaneName)
    console.log(locBase)
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
          {locBase.map(item => (<Marker key={item[0]} latitude={item[2]} longitude={item[3]}>
            <Airplane style={item[17]===clickSelect ? selectColor : defaultColor}/>
            <div>{item[17] || 'Без названия'}</div>
          </Marker>))}
        </ReactMapGL>
        <Radar />
      </div>
      <div className="table">
        {locBase.map(item => (
          <div onClick={clickHandler} key={item[0]} className="tableElement">
            <h1 >{item[17] || ""}</h1>
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
