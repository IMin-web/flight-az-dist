import { useState, useEffect } from "react";
import React from "react";
import './App.css'
import ReactMapGL, { Marker} from 'react-map-gl';
import { ReactComponent as Airplane } from './marker.svg';
import { d10, d50, d100, az10, az30 } from "./circle";

function App() {
  const [locBase, setLocBase] = useState([])

  useEffect(() => {
    locate()
  });

  function locate() { //Запрос данных с FlightRadar24
    const url = 'http://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=65,58.4,57.5,68.4&adsb=1&air=1&array=1'
    return fetch(url, {
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      referrerPolicy: 'no-referrer'
    })
      .then(res => res.json())
      .then(res =>{return res.aircraft})
      .then(res => setLocBase(res))
  }
  
  const [viewport, setViewport] = React.useState({  //Карта
    latitude: 0,
    longitude: 0,
    zoom: 5.8,
    mapboxApiAccessToken: 'pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA',
  });

  return (
    <div className="window">
      <div className="radar">
        <div className="position">
          <ReactMapGL id="666" {...viewport} width="100%" height="100%" mapStyle='mapbox://styles/mapbox/streets-v11' onViewportChange={(viewport) => setViewport(viewport)}>
            {locBase.map(item => (<Marker key={item} latitude={item[2]} longitude={item[3]}>
              <Airplane/>
            </Marker>))}
          </ReactMapGL>
          {d10[0].map(item => (<div key={item} className="range" style={{ 'width': `${d10[1][item]}px`, 'height': `${d10[1][item]}px`, borderWidth: '1px' }}></div>))}
          {d50[0].map(item => (<div key={item} className="range" style={{ 'width': `${d50[1][item]}px`, 'height': `${d50[1][item]}px`, borderWidth: '2px' }}></div>))}
          {d100[0].map(item => (<div key={item} className="range" style={{ 'width': `${d100[1][item]}px`, 'height': `${d100[1][item]}px`, borderWidth: '3px' }}></div>))}
          {az10[0].map(item => (<div key={item} className="azimut" style={{ transform: `rotate(${az10[1][item]}deg)`, borderWidth: '1px', borderTop: '1px solid rgb(124, 124, 124, 0.568)' }}></div>))}
          {az30[0].map(item => (<div key={item} className="azimut" style={{ transform: `rotate(${az30[1][item]}deg)`, borderWidth: '1px', borderTop: '1px solid rgb(0, 0, 0)' }}></div>))}
        </div>
        <div className="data">
          {locBase.map(item => (
            <div key={item}>
                  <h1>{item[14] || 'Без названия'}</h1>
                  <p>Высота: {(Math.round((item[5]) / 0.33)) / 10}</p>
                  <p>Скорость: {Math.round((item[6]) * 1.87)}</p>
                  <p>Курс: {item[4]}</p>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}
export default App;
