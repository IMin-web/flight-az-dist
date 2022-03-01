import { useState, useEffect } from "react";
import React from "react";
import "./App.css";
import Map, { Marker, FullscreenControl} from "react-map-gl";
import locate from "./locate";
import Dalnost from "./Dalnost";
import Azimut from "./Azimut";

function App() {
  const [locBase, setLocBase] = useState([]);
  const latRef = React.createRef();
  const lonRef = React.createRef();
  const [lat, setLat] = useState(61.28527651284786);
  const [lon, setLon] = useState(63.17582723137468);
  const [form, setForm] = useState();
  const [dalnost, setDalnost] = useState(0);
  const [azimut, setAzimut] = useState(0);
  const [azimutOn, setAzimutOn] = useState(false);

  const d = 300;

  useEffect(() => {
    let massD = [];
    for (let i = 0; i < d; i + 10) {
      i += 10;
      massD.push(i);
    }
    console.log(massD.map((item)=>{console.log(Math.floor(item/50))}));
    setDalnost(massD);
    let a = [];
    for (let i = 0; i < 180; i + 10) {
      i += 10;
      a.push(i);
    }
    setAzimut(a);
  }, []);

  useEffect(() => {
    try{
      const footer = document.querySelector(".footer");
      footer.style.display = "none";
    } catch(e){console.log(e)}

  }, []);

  const onMarkerClick = (item, event) => {
    item[0] === form ? setForm(0) : setForm(item[0]);
    event.stopPropagation();
  };

  function getRadar() {
    if (latRef.current.value && lonRef.current.value) {
      let lat1 = +latRef.current.value;
      let lon1 = +lonRef.current.value;
      if ((lat1 >= -84) & (lon1 >= -178)) {
        setLat(lat1);
        setLon(lon1);
        setViewport({
          latitude: lat1,
          longitude: lon1,
          zoom: 5.8,
          mapboxApiAccessToken:
            "pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJja3dqODA3ZnMxZHA4Mm9udnlmOXdxMXQwIn0.s79NCW6WTu9I94Wv7MhNDA",
        });
      } else {
        alert("Введите верные координаты!");
      }
    } else {
      alert("Введите обе координаты!");
    }
  }

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
      <div className="control__panel">
        <div className="input__radar">
          <input
            ref={latRef}
            defaultValue={0}
            placeholder="Введите latitude"
            type="text"
            name="lat"
            id="lat"
            className="form"
          />
          <input
            ref={lonRef}
            defaultValue={0}
            placeholder="Введите longitude"
            type="text"
            name="lon"
            id="lon"
            className="form"
          />
          <button onClick={getRadar} type="submit" className="btn">
            Ввод
          </button>
        </div>
        <label class="switch">
          <input
            onChange={(e) => {
              setAzimutOn(e.target.checked);
            }}
            type="checkbox"
          />
          <span class="slider round"></span>
        </label>
      </div>
      <div className="radar">
        <div className="position">
          <Map
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
          >
            {locBase.map((item) => (
              <Marker key={item[0]} latitude={item[2]} longitude={item[3]}>
                <svg onClick={(e) => onMarkerClick(item, e)} />
                <div className="marker__name">{item[17] || "Без названия"}</div>
                {form === item[0] ? (
                  <div
                    onClick={(e) => onMarkerClick(item, e)}
                    key={item[0]}
                    className="tableElement"
                  >
                    <p>Азимут: {Math.round(item[20])}</p>
                    <p>Дальность: {Math.round(item[19] / 100) / 10}</p>
                    <p>Высота: {Math.round(item[5] / 0.33) / 10}</p>
                    <p>Скорость: {Math.round(item[6] * 1.87)}</p>
                    <p>Курс: {item[4]}</p>
                  </div>
                ) : null}
              </Marker>
            ))}
            <Marker className="center" latitude={lat} longitude={lon}>
              {azimutOn ? (
                <>
                  <div className="range">
                    {dalnost.map((item) => (
                      <>
                      {item%50 ?
                      <div
                        key={item}
                        style={{
                          width: `${item * 3}px`,
                          height: `${item * 3}px`,
                          borderWidth: "1px",
                        }}
                      ></div>
                      : <div
                      key={item}
                      style={{
                        width: `${item * 3}px`,
                        height: `${item * 3}px`,
                        borderWidth: "2px",
                      }}
                    ></div>
                    }
                      </>
                      
                    ))}
                  </div>
                  <div className="azimut">
                    {azimut.map((item) => (
                      <>
                      {item%30 ? 
                      <div
                      key={item}
                      style={{
                        transform: `rotate(${item}deg)`,
                        borderWidth: "1px",
                        borderTop: "1px solid rgb(124, 124, 124, 0.568)",
                      }}
                    ></div>
                    :
                    <div
                      key={item}
                      style={{
                        transform: `rotate(${item}deg)`,
                        borderWidth: "1px",
                        borderTop: "2px solid rgb(124, 124, 124, 0.568)",
                      }}
                    ></div>
                  }</>
                    ))}
                  </div>
                </>
              ) : null}
            </Marker>
            <FullscreenControl />
          </Map>
        </div>
      </div>
    </div>
  );
}
export default App;
