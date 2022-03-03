import { useState, useEffect } from "react";
import React from "react";
import "./Radar24.css";
import Map, { Marker, FullscreenControl} from "react-map-gl";
import Radar from "./Radar";
import locate from "./locate";
import Dalnost from "./Dalnost";
import Azimut from "./Azimut";
import MarkerRadar from "./MarkerRadar";
import ControlPanel from "./ControlPanel";

function Radar24() {
  const [locBase, setLocBase] = useState([]);
  const [lat, setLat] = useState(61.28527651284786);
  const [lon, setLon] = useState(63.17582723137468);
  const [azimutOn, setAzimutOn] = useState(false);
  // let granica1 = lat + 2.6;
  // let granica2 = lon - 5.7;
  // let granica3 = lat - 2.8;
  // let granica4 = lon + 5.4;
  const [form, setForm] = useState(0);

  const onMarkerClick = (item, event) => {
    item[0] === form ? setForm(0) : setForm(item[0]);
    try{
    event.stopPropagation();}
    catch(e){return}
  };

  function coordinates(lat, lon){
    setLat(lat);
    setLon(lon);
    setViewport({
      latitude: lat,
      longitude: lon,
      zoom: 5.8,
      mapboxApiAccessToken:
        "pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA",
    });
  }

  function radarON(e){
    setAzimutOn(e.target.checked);
  }

  useEffect(() => {
    try{
    const footer = document.querySelector(".footer");
    footer.style.display = "none";
    }catch(e){return}
  }, []);

  useEffect(() => {
    let result;
    locate(lat, lon)
      .then((res) => (result = res))
      .then((res) => result.map((item) => item.push(Dalnost(item, lat, lon))))
      .then((res) => result.map((item) => item.push(Azimut(item, lat, lon))))
      .then((res) => setLocBase(result));
  });

  const [viewport, setViewport] = React.useState({
    //Карта
    latitude: lat,
    longitude: lon,
    zoom: 5.8,
    mapboxApiAccessToken:
      "pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA",
  });

  return (
    <div className="radar24">
      <ControlPanel radarON={radarON} coordinates={coordinates}></ControlPanel>
        <div className="radar24__position">
          <Map classname="radar24__map"
            id="666"
            scrollZoom={false}
            doubleClickZoom={false}
            dragRotate={false}
            boxZoom={false}
            dragPan={false}
            {...viewport}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={setViewport}
            onClick={() => onMarkerClick(0)}
          >
            <MarkerRadar form={form} onMarkerClick={onMarkerClick} lat={lat} lon={lon} locBase={locBase} ></MarkerRadar>
            <Marker latitude={lat} longitude={lon}>
              {azimutOn ? <Radar/> : null}
            </Marker>
            <FullscreenControl />
          </Map>
      </div>
    </div>
  );
}
export default Radar24;
