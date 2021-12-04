import { useState, useEffect } from "react";
import React from "react";
import './App.css'
import ReactMapGL, { Marker } from 'react-map-gl';
import { ReactComponent as Airplane } from './marker.svg';
import { d10, d50, d100, az10, az30 } from "./circle";

function App() {
  const [locBase, setLocBase] = useState([])

  useEffect(() => {
    locate()
  });

  function locate() { //Запрос данных с FlightRadar24
    const headers = {
      'User-Agent': 'https://github.com/derhuerst/fetch-flightradar24-flights'
    }
    const url = 'https://data-live.flightradar24.com/zones/fcgi/feed.json'
    return fetch(url, {
      mode: 'cors',
      redirect: 'follow',
      headers,
      referrer: 'no-referrer',
      referrerPolicy: 'no-referrer'
    })
      .then(res => res.json())
      .then(res => {
        const base = []
        for (let key in res) {
            if ((res[key][1] > 58.4 && res[key][1] < 65) && (res[key][2] > 57.2 && res[key][2] < 68.7)){
              base.push(res[key])
            }
          }
        return base
      }
      )
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
            {locBase.map(item => (<Marker key={item} latitude={item[1]} longitude={item[2]}>
              <Airplane />
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
            <table key={item}>
              <thead>
                <tr>
                  <th colSpan="2">{item[16]}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Высота</td>
                  <td>{(Math.round((item[4]) / 0.33)) / 10}</td>
                </tr>
                <tr>
                  <td>Скорость</td>
                  <td>{Math.round((item[5]) * 1.87)}</td>
                </tr>
                <tr>
                  <td>Курс</td>
                  <td>{item[3]}</td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div >
  );
}
export default App;
