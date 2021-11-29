import { useState, useEffect} from "react";
import React from "react";
import './App.css'
import ReactMapGL, {Marker} from 'react-map-gl';

function App() {
  const [base, setBase] = useState('');
  const [show, setShow] = useState(false)
  let [name, setName] = useState('')

  let nameInput = React.createRef()

  useEffect(() => {
    if (name) {
      fetch(`./fetch/data/${name}.json`)
        .then(response => response.json())
        .then(text => setBase(text))
        .then(response => setShow(true))
    } else {
      console.log('Введите номер самолета')
    }
  })

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
          {show && <Marker latitude={base.features[0].geometry.coordinates[base.features[0].geometry.coordinates.length-1][1]} longitude={base.features[0].geometry.coordinates[base.features[0].geometry.coordinates.length-1][0]}>
        <div className="marker"></div>
      </Marker>}
        
      </ReactMapGL>
        <div className="circle circle300 c1"/>
        <div className="circle circle250 c2"/>
        <div className="circle circle200 c1"/>
        <div className="circle circle150 c2"/>
        <div className="circle circle100 c1"/>
        <div className="circle circle50 c2"/>
          <div className="dalnost az1"/>
          <div className="dalnost dalnost10 az3"/>
          <div className="dalnost dalnost20 az3"/>
          <div className="dalnost dalnost30 az2"/>
          <div className="dalnost dalnost40 az3"/>
          <div className="dalnost dalnost50 az3"/>
          <div className="dalnost dalnost60 az2"/>
          <div className="dalnost dalnost70 az3"/>
          <div className="dalnost dalnost80 az3"/>
          <div className="dalnost dalnost90 az1"/>
          <div className="dalnost dalnost100 az3"/>
          <div className="dalnost dalnost110 az3"/>
          <div className="dalnost dalnost120 az2"/>
          <div className="dalnost dalnost130 az3"/>
          <div className="dalnost dalnost140 az3"/>
          <div className="dalnost dalnost150 az2"/>
          <div className="dalnost dalnost160 az3"/>
          <div className="dalnost dalnost170 az3"/>
          <div className="dalnost dalnost180 az1"/>
        </div>
        <div className="data">
        {show &&
            <table>
              <thead>
                <tr>
                  <th colSpan="2">{base.features[0].properties.pop().number}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Высота</td>
                  <td>{base.features[0].properties.pop().altitude.meters}</td>
                </tr>
                <tr>
                  <td>Скорость</td>
                  <td>{base.features[0].properties.pop().speed.kmh}</td>
                </tr>
                <tr>
                  <td>Курс</td>
                  <td>{base.features[0].properties.pop().heading}</td>
                </tr>
              </tbody>
            </table>
          }
          <input ref={nameInput} defaultValue="tup8803"></input>
          <button onClick={() => setName(nameInput.current.value.toUpperCase())}>Вывести таблицу</button>
          </div>
      </div>
    </div >
  );
}

export default App;
