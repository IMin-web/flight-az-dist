import { useState, useEffect } from "react";
import React, { useRef } from "react";
import "./Radar24.css";
import Radar from "./Radar";
import locate from "./locate";
import Dalnost from "./Dalnost";
import Azimut from "./Azimut";
import ControlPanel from "./ControlPanel";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

function Radar24() {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJjbDNlZmVmNHIwYnJvM2JwNmh5dW1iNDI3In0.ne2arVpZtSj4RSykE0hLdw";
  const [locBase, setLocBase] = useState([]);
  const [lat, setLat] = useState(61.28527651284786);
  const [lon, setLon] = useState(63.17582723137468);
  const [radius, setRadius] = useState(300);
  const [azimutOn, setAzimutOn] = useState(false);
  const [time1, setTime1] = useState();
  const [time2, setTime2] = useState();
  const [allFormsOn, setAllFormsOn] = useState(false);
  const [markers, setMarkers] = useState([]);
  let latPred;
  let lonPred;
  // let granica1 = lat + 2.6;
  // let granica2 = lon - 5.7;
  // let granica3 = lat - 2.8;
  // let granica4 = lon + 5.4;
  const [form, setForm] = useState(0);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lon, lat],
      zoom: zoom,
    });
  });

  const onMarkerClick = (item, event) => {
    if (!allFormsOn) {
      item[0] === form ? setForm(0) : setForm(item[0]);
      try {
        event.stopPropagation();
      } catch (e) {
        return;
      }
    } else {
      return;
    }
  };

  function coordinates(lat, lon, rad) {
    setLat(+lat);
    setLon(+lon);
    if (rad) {
      setRadius(+rad);
    }
    if (rad) {
      setViewport({
        latitude: lat,
        longitude: lon,
        zoom: 5.8,
      });
    }
  }

  function radarON(e) {
    setAzimutOn(e.target.checked);
  }
  function allForms(e) {
    setAllFormsOn(e.target.checked);
  }

  useEffect(() => {
    try {
      const footer = document.querySelector(".footer");
      footer.style.display = "none";
    } catch (e) {
      return;
    }
  }, []);

  function addPopup(item) {
    return `<p>Азимут: ${Math.round(item[20])}</p>
      <p>Дальность: ${Math.round(item[19] / 100) / 10}</p>
      <p>Высота: ${Math.round(item[5] / 0.33) / 10}</p>
      <p>Скорость: ${Math.round(item[6] * 1.87)}</p>
      <p>Курс: ${item[4]}</p>`;
  }

  function addMarker(item, array) {
    const popup = new mapboxgl.Popup({
      offset: 25,
    })
      .setHTML(addPopup(item))
      .addClassName("marker__table");
    const airplaneCont = document.createElement("div");
    const airplane = document.createElement("div");
    const name = document.createElement("div");
    airplaneCont.className = "radar24__marker__cont";
    airplane.className = "radar24__marker";
    airplane.id = item[0];
    airplane.style.transform = `rotate(${item[4] - 90}deg)`;
    airplaneCont.appendChild(airplane);
    airplaneCont.appendChild(name);
    name.className = "marker__name";
    name.innerHTML = `${item[17] || "Без названия"}`;
    const marker = new mapboxgl.Marker(airplaneCont)
      .setLngLat([item[3], item[2]])
      .setPopup(popup)
      .addTo(map.current);
    array.push(marker);
  }

  function addTrack(item) {
    const track = document.createElement("div");
    track.className = "radar24__track";
    const trackPoint = new mapboxgl.Marker(track)
      .setLngLat([item[3], item[2]])
      .addTo(map.current);
  }

  useEffect(() => {
    if (markers.length === locBase.length) {
      locBase.map((item) => {
        markers.map((i) => {
          if (i.getElement().firstElementChild.id === item[0]) {
            i.setLngLat([item[3], item[2]]);
            i.getElement().firstElementChild.transform = `rotate(${
              item[4] - 90
            }deg)`;
            const pop = i.getPopup();
            pop.setHTML(addPopup(item));
            // addTrack(item)
          }
        });
      });
    } else {
      const array = [...markers];
      if (locBase.length > markers.length) {
        locBase.map((item) => {
          if (markers.length === 0) {
            addMarker(item, array);
          } else {
            const arr = markers.map((i) => {
              if (item[0] === i.getElement().firstElementChild.id) {
                return true;
              } else {
                return false;
              }
            });
            if (arr.includes(true)) {
              return;
            } else {
              addMarker(item, array);
            }
            return;
          }
        });

        setMarkers(array);
        return;
      } else if (locBase.length < markers.length) {
        const array = [];
        markers.map((i) => {
          const arr = locBase.map((item) => {
            if (item[0] === i.getElement().firstElementChild.id) {
              return true;
            } else {
              return false;
            }
          });
          console.log(!arr.includes(true));
          if (!arr.includes(true)) {
            i.remove();
            console.log(`delete ${i.getElement().firstElementChild.id}`);
            return;
          } else {
            array.push(i);
            return;
          }
        });
        setMarkers(array);
      }
      return;
    }
    if (!map.current) return; // wait for map to initialize
  }, [locBase]);

  useEffect(() => {
    clearTimeout(time1);
    clearTimeout(time2);
    //запрос данных с FlightRadar24 по введенным координатам
    setTime1(
      setTimeout(function work() {
        latPred = +radius / (Math.cos(+lat * (Math.PI / 180)) * 111.321377778);
        lonPred = +radius / 111.134861111;
        locate(lat, lon, latPred, lonPred)
          .then((res) => {
            res.map((item) => {
              item.push(Dalnost(item, lat, lon));
              item.push(Azimut(item, lat, lon));
            });
            return res;
          })
          //добавление в массив результатов азимута самолета
          .then((res) => setLocBase(res))
          .then((res) => setTime2(setTimeout(work, 1000)))
          .catch((err) => console.log(err));
        // });
      }, 1000)
    );
  }, [lat, lon, radius]);

  const [viewport, setViewport] = React.useState({
    //Карта
    latitude: lat,
    longitude: lon,
    zoom: 5.8,
  });

  return (
    <div className="radar24">
      <ControlPanel
        allForms={allForms}
        radarON={radarON}
        lat={lat}
        lon={lon}
        radius={radius}
        coordinates={coordinates}
      ></ControlPanel>
      <div className="radar24__position">
        <div
          ref={mapContainer}
          className="radar24__map"
          id="666"
          {...viewport}
          width="100%"
          height="100%"
          onClick={() => onMarkerClick(0)}
        />
      </div>
    </div>
  );
}
export default Radar24;
