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
  const latRef= React.createRef()
  const lonRef= React.createRef()
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)

  function clickHandler(event) {
    let airplaneName = event.currentTarget;
    airplaneName = airplaneName.outerText.slice(0, airplaneName.outerText.indexOf('\n'));
    setClickSelect(airplaneName);
  }

  function getRadar(){
    if(latRef.current.value && lonRef.current.value){
        let lat1 = +latRef.current.value;
        let lon1 = +lonRef.current.value;
        console.log(lat,lon)
        if(lat1 >= -84 & lon1 >= -178){
          setLat(lat1)
          setLon(lon1)
          console.log(`http://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=${lat1+2.6},${lon1-4.7},${lat1-3.8},${lon1+5.5}&adsb=1&air=1&array=1`)
          setViewport({
            latitude:lat1,
            longitude:lon1,
            zoom: 5.8,
            mapboxApiAccessToken: 'pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA',
          })
        }
        else {
          alert('Введите верные координаты!')
        }
    } else {
      alert('Введите обе координаты!')
    }
  }

  useEffect(() => {
    let result;
    locate(lat, lon)
      .then(res => result = res)
      .then(res => result.map(item => item.push(Dalnost(item, lat, lon))))
      .then(res => result.map(item => item.push(Azimut(item, lat, lon))))
      .then(res => setLocBase(result))
  });

  const [viewport, setViewport] = React.useState({  //Карта
    latitude: lat,
    longitude: lon,
    zoom: 5.8,
    mapboxApiAccessToken: 'pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA',
  });

  return (
    <>
    <div className="input">
    <input ref={latRef} defaultValue={0} placeholder="Введите latitude" type="text" name="lat" id="lat" className="form" />
    <input ref={lonRef} defaultValue={0} placeholder="Введите longitude" type="text" name="lon" id="lon" className="form" />
    <button onClick={getRadar} type="submit" className="btn">Ввод</button>
    </div>
    <div className="radar">
      <div className="position">
        <ReactMapGL id="666" {...viewport} width="100%" height="100%" mapStyle='mapbox://styles/mapbox/streets-v11' onViewportChange={setViewport}>
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
    </>
  );
}
export default App;
