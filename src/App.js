import { useState, useEffect } from "react";
import React from "react";
import './App.css'
import ReactMapGL, { Marker } from 'react-map-gl';
import { ReactComponent as Airplane } from './marker.svg';
import { d10, d50, d100, az10, az30} from "./circle";
const qs = require('querystring')


function App() {
  const [data, setData] = useState('');
  const [show, setShow] = useState(false)
  let nameInput = React.createRef()

  useEffect(() => {
    if (nameInput.current.value) {
      zapros();
    } else {
      console.log('Введите номер самолета!')
    }
  });

  function zapros() {
    let flight = nameInput.current.value;
    const endpoint = 'https://data-live.flightradar24.com/clickhandler/'
    const headers = {
      'User-Agent': 'https://github.com/derhuerst/fetch-flightradar24-flights'
    }
    const url = endpoint + '?' + qs.stringify({ flight, version: '1.5' })
    return fetch(url, {
      mode: 'cors',
      redirect: 'follow',
      headers,
      referrer: 'no-referrer',
      referrerPolicy: 'no-referrer'
    })
      .then(res => res.json())
      .then(res => setData(res))
      .then(res => setShow(true))
  }
  console.log(az10[0].length)
  const [viewport, setViewport] = React.useState({
    latitude: 0,
    longitude: 0,
    zoom: 5.8,
    mapboxApiAccessToken: 'pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA',
  });
  return (
    <div>
      <div className="radar">
        <div className="position">
          <ReactMapGL {...viewport} width="100%" height="100%" mapStyle='mapbox://styles/mapbox/streets-v11' onViewportChange={(viewport) => setViewport(viewport)}>
            {show && <Marker latitude={data.trail[0].lat} longitude={data.trail[0].lng}>
            <Airplane/>
            </Marker>}
          </ReactMapGL>
          {d10[0].map(item=>(<div key={item} className="range" style={{'width': `${d10[1][item]}px`, 'height': `${d10[1][item]}px`, borderWidth: '1px'}}></div>))}
          {d50[0].map(item=>(<div key={item} className="range" style={{'width': `${d50[1][item]}px`, 'height': `${d50[1][item]}px`, borderWidth: '2px'}}></div>))}
          {d100[0].map(item=>(<div key={item} className="range" style={{'width': `${d100[1][item]}px`, 'height': `${d100[1][item]}px`, borderWidth: '3px'}}></div>))}
          {az10[0].map(item=>(<div key={item} className="azimut" style={{transform: `rotate(${az10[1][item]}deg)`, borderWidth: '1px', borderTop:'1px solid rgb(124, 124, 124, 0.568)'}}></div>))}
          {az30[0].map(item=>(<div key={item} className="azimut" style={{transform: `rotate(${az30[1][item]}deg)`, borderWidth: '1px', borderTop:'1px solid rgb(0, 0, 0)'}}></div>))}
        </div>
        <div className="data">
          {show &&
            <table>
              <thead>
                <tr>
                  <th colSpan="2">{data.identification.number.default}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Высота</td>
                  <td>{(Math.round((data.trail[0].alt)/0.3048))/10}</td>
                </tr>
                <tr>
                  <td>Скорость</td>
                  <td>{(data.trail[0].spd)*1,852}</td>
                </tr>
                <tr>
                  <td>Курс</td>
                  <td>{data.trail[0].hd}</td>
                </tr>
              </tbody>
            </table>
          }
          <input ref={nameInput}></input>
          <button onClick={zapros}>Запрос</button>
        </div>
      </div>
    </div >
  );
}
export default App;
