import { useState, useEffect } from "react";
import React from "react";
import './App.css'
import ReactMapGL, { Marker } from 'react-map-gl';
import { ReactComponent as Airplane } from './marker.svg';
import Radar from './Radar'
import locate from "./locate";

function App() {
  const [locBase, setLocBase] = useState([])
  const [dalnost, setDalnost] = useState([])
  const [clickSelect, setClickSelect] = useState()
  const defaultColorMarker = { 'fill': 'black' }
  const selectColorMarker = { 'fill': 'red',
'animation-name':'bounce', 
'animation-duration':'0.5s', }
  const defaultColorTable = { 'background-color': 'rgba(211, 211, 211, 0.781)' }
  const selectColorTable = { 'background-color': 'rgb(214, 115, 69)' }
  const lat1 = 0;
  const lon1 = 0;
  
  function clickHandler(event) {
    let airplaneName = event.currentTarget
    airplaneName = airplaneName.outerText.slice(0, airplaneName.outerText.indexOf('\n'))
    console.log(airplaneName)
    setClickSelect(airplaneName)
    console.log(dalnost)
  }

  useEffect(() => {
    let result;
    locate()
    .then(res => result = res)
    .then(res => result.map(item=> item.push(Dalnost(item))))
    .then(res => result.map(item=> item.push(Azimut(item))))
    // .then(res => console.log(res))
    .then(res => setLocBase(result))
      
      // .then(res => result.map(item => Dalnost(item)))
      // .then(res => setDalnost(res))
  });

  const [viewport, setViewport] = React.useState({  //Карта
    latitude: lat1,
    longitude: lon1,
    zoom: 5.8,
    mapboxApiAccessToken: 'pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA',
  });

  function Dalnost(item){
    let lat2 = item[2] ;
    let lon2 = item[3] ;
  const R = 6371e3; // metres
const φ1 = lat1 * Math.PI/180; // φ, λ in radians
const φ2 = lat2 * Math.PI/180;
const Δφ = (lat2-lat1) * Math.PI/180;
const Δλ = (lon2-lon1) * Math.PI/180;

const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

const d = R * c; // in metres
return d;
}

function Azimut(item){
  let lat2 = item[2] ;
  let lon2 = item[3] ;
  const y = Math.sin(lon2-lon1) * Math.cos(lat2);
const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
let θ = Math.atan2(y, x);
// const brng = (θ+360) % 360; // in degrees
const brng = (θ*180/Math.PI + 360) % 360; // in degrees
return brng
//   let lat2 = item[2] ;
//   let lon2 = item[3] ;
//   const y = Math.sin(lon2-lon1) * Math.cos(lat2);
// const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
// const θ = Math.atan2(y, x);
// const brng = (θ*180/Math.PI + 360) % 360; // in degrees
// return brng
}


  return (
    <div className="radar">
      <div className="position">
        <ReactMapGL id="666" {...viewport} width="100%" height="100%" mapStyle='mapbox://styles/mapbox/streets-v11' onViewportChange={(viewport) => setViewport(viewport)}>
          {locBase.map(item => (<Marker key={item[0]} latitude={item[2]} longitude={item[3]}>
            <Airplane style={item[17]===clickSelect ? selectColorMarker : defaultColorMarker}/>
            <div>{item[17] || 'Без названия'}</div>
          </Marker>))}
        </ReactMapGL>
        <Radar />
      </div>
      <div className="table">
        {locBase.map(item => (
          <div onClick={clickHandler} key={item[0]} className="tableElement">
            <h1 style={item[17]===clickSelect ? selectColorTable : defaultColorTable} >{item[17] || ""}</h1>
            <p>Высота: {(Math.round((item[5]) / 0.33)) / 10}</p>
            <p>Скорость: {Math.round((item[6]) * 1.87)}</p>
            <p>Курс: {item[4]}</p>
            <p>Дальность: {Math.round((item[19]) / 100)/10}</p>
            <p>Азимут: {Math.round(item[20])}</p>
            {/* <p>Latitude: {item[2]}</p> */}
            {/* <p>Longitude: {item[3]}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
