import { useState, useEffect } from "react";
import React from "react";
import './App.css';
import ReactMapGL, { Marker } from 'react-map-gl';
import { ReactComponent as Airplane } from './marker.svg';
import Radar from './Radar';
import locate from "./locate";
import Dalnost from "./Dalnost";
import Azimut from "./Azimut";
import {defaultColorMarker, selectColorMarker} from "./MarkerColor";

function App() {
  const [locBase, setLocBase] = useState([])
  const [clickSelect, setClickSelect] = useState()
  const defaultColorTable = { 'background-color': 'rgba(211, 211, 211, 0.781)' }
  const selectColorTable = { 'background-color': 'rgb(214, 115, 69)' }
  const lat1 = 0;
  const lon1 = 0;

  function clickHandler(event) {
    let airplaneName = event.currentTarget;
    airplaneName = airplaneName.outerText.slice(0, airplaneName.outerText.indexOf('\n'));
    console.log(airplaneName);
    setClickSelect(airplaneName);
  }

  useEffect(() => {
    let result;
    locate()
      .then(res => result = res)
      .then(res => result.map(item => item.push(Dalnost(item, lat1, lon1))))
      .then(res => result.map(item => item.push(Azimut(item, lat1, lon1))))
      .then(res => setLocBase(result))
  });

  const [viewport, setViewport] = React.useState({  //Карта
    latitude: lat1,
    longitude: lon1,
    zoom: 5.8,
    mapboxApiAccessToken: 'pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA',
  });

  return (
    <div className="radar">
      <div className="position">
        <ReactMapGL id="666" {...viewport} width="100%" height="100%" mapStyle='mapbox://styles/mapbox/streets-v11' onViewportChange={(viewport) => setViewport(viewport)}>
          {locBase.map(item => (<Marker key={item[0]} latitude={item[2]} longitude={item[3]}>
            <Airplane style={item[17] === clickSelect ? selectColorMarker(item[4]) : defaultColorMarker(item[4])} />
            <div>{item[17] || 'Без названия'}</div>
          </Marker>))}
        </ReactMapGL>
        <Radar/>
      </div>
      <div className="table">
        {locBase.map(item => (
          <div onClick={clickHandler} key={item[0]} className="tableElement">
            <h1 style={item[17] === clickSelect ? selectColorTable : defaultColorTable} >{item[17] || "Без названия"}</h1>
            <p>Азимут: {Math.round(item[20])}</p>
            <p>Дальность: {Math.round((item[19]) / 100) / 10}</p>
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
