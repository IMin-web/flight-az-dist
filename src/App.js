import { useState, useEffect} from "react";
import React from "react";
import './App.css'
import ReactMapGL, { Marker} from 'react-map-gl';
import { ReactComponent as Airplane } from './marker.svg';
import Radar from './Radar'
import locate from "./locate";

function App() {
  const [locBase, setLocBase] = useState([])
  const [selectAirplane, setselectAirplane] = useState([])
  const defaultColor ={'fill':'yellow'}
  const selectColor = {'fill':'red'}
  const click = React.createRef()

  function clickHandler() {
    async function select(){
    let airplaneName = click.current.innerHTML;
    let newlocBase = locBase.map(item=> {
      if(item[17] === airplaneName){
        item[19] = selectColor;
        return item
      }
      else{
        return item
      }
  }) 
  await setselectAirplane(newlocBase)}
console.log(selectAirplane)
  select()
}

  useEffect(() => {
    let result;
    locate()
    .then(res => result = res)
    .then(res => result = result.map(item => item.concat(defaultColor)))
    .then(res=> setLocBase(result))
  });

  const [viewport, setViewport] = React.useState({  //Карта
    latitude: 61.285304344909235,
    longitude: 63.175818109252496,
    zoom: 5.8,
    mapboxApiAccessToken: 'pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA',
  });


  return (
      <div className="radar">
        <div className="position">
          <ReactMapGL id="666" {...viewport} width="100%" height="100%" mapStyle='mapbox://styles/mapbox/streets-v11' onViewportChange={(viewport) => setViewport(viewport)}>
            {locBase.map(item => (<Marker key={item[0]} latitude={item[2]} longitude={item[3]}>
              <Airplane /><div>{item[17] || 'Без названия'}</div>
              {/* <Airplane style={selectAirplane[item][19] || defaultColor}/><div>{item[17] || 'Без названия'}</div> */}
            </Marker>))}
          </ReactMapGL>
          <Radar/>
        </div>
        <div className="table">
          {locBase.map(item => (
            <div key={item[0]}>
                  <h1  onClick={clickHandler} ref={click} >{item[17] || 'Без названия'}</h1>
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
