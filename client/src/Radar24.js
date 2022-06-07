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
import { addPopup, addMarker } from "./MarkerRadar";
import MapboxCircle from 'mapbox-gl-circle'

function Radar24() {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoib3ZlcmJyYXRzayIsImEiOiJjbDNlZmVmNHIwYnJvM2JwNmh5dW1iNDI3In0.ne2arVpZtSj4RSykE0hLdw";
  const [locBase, setLocBase] = useState([]); //Массив самолетов после запроса
  const [lat, setLat] = useState(61.28527651284786); //Широта центра поиска
  const [lon, setLon] = useState(63.17582723137468); // Долгота центра поиска
  const [radius, setRadius] = useState(300); //Текущий радиус поиска
  const [time1, setTime1] = useState(); //Таймер 1
  const [time2, setTime2] = useState(); //Таймер 2
  const [markers, setMarkers] = useState([]); //Массив маркеров
  const [popups, setPopups] = useState([]); //Массив формуляров для каждого маркера
  const [track, setTrack] = useState([]); //Массив треков для каждого маркера
  let latPred;
  let lonPred;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(6);

  //Инициализация карты
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lon, lat],
      zoom: zoom,
    });
    map.current.doubleClickZoom.disable();
    const marker = new mapboxgl.Marker({
      anchor: "bottom",
    })
      .setLngLat([lon, lat])
      .addTo(map.current);
    const nav = new mapboxgl.NavigationControl();
    map.current.addControl(nav, "top-left");
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: "metric",
    });
    map.current.addControl(scale);
    const center ={lat: lat, lng: lon}
    var circle = new MapboxCircle(center, radius*1000, {
      editable: true,
      // fillOpacity: 0,
      strokeWeight: 2,
  }).addTo(map.current);
  circle.on("radiuschanged", function(circleObj) {
    const result = circleObj.getRadius()/1000
    setRadius(result)
  });
    map.current.on("dblclick", (event) => {
      const coordinates = event.lngLat
      marker.setLngLat([coordinates.lng,coordinates.lat]);
      setLat(coordinates.lat);
      setLon(coordinates.lng);
      circle.setCenter({lat: coordinates.lat, lng: coordinates.lng});
    });
    
  });

  function clearTrack() {
    const newTrack = {};
    for (let prop in track) {
      locBase.map((item) => {
        if (item[0] === prop) {
          newTrack[item[0]] = track[item[0]];
        } else {
          return;
        }
      });
      if (prop in newTrack) {
      } else {
        map.current.removeLayer(`${prop}`);
      }
    }
    setTrack(newTrack);
  }

  function allForms(e) {
    if (e.target.checked) {
      popups.map((item) => item.addTo(map.current));
    } else {
      popups.map((item) => item.remove());
    }
  }

  ///Отключение футера
  useEffect(() => {
    try {
      const footer = document.querySelector(".footer");
      footer.style.display = "none";
    } catch (e) {
      return;
    }
  }, []);

  ///Обновленние, добавление или удаление маркеров
  useEffect(() => {
    // console.log(track)
    if (markers.length === locBase.length) {
      //Если количество маркеров равно количеству самолетов в зоне
      locBase.map((item) => {
        markers.map((i) => {
          if (i.getElement().firstElementChild.id === item[0]) {
            i.setLngLat([item[3], item[2]]);
            i.getElement().firstElementChild.transform = `rotate(${
              item[4] - 90
            }deg)`;
            const pop = i.getPopup();
            pop.setHTML(addPopup(item));
            const data = {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: track[item[0]],
              },
            };
            if (track[item[0]]) {
              map.current.getSource(`${item[0]}`).setData(data);
            }
          }
        });
      });
    } else {
      const array = [...markers];
      const arrayPopups = [...popups];
      if (locBase.length > markers.length) {
        // Если самолет вошел в зону
        locBase.map((item) => {
          if (markers.length === 0) {
            addMarker(map, item, array, arrayPopups, track);
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
              console.log("новый маркер");
              addMarker(map, item, array, arrayPopups, track);
            }
            return;
          }
        });
        setPopups(arrayPopups);
        setMarkers(array);
        return;
      } else if (locBase.length < markers.length) {
        //Если самолет вышел из зоны
        const array = [];
        const arrayPopups = [];
        markers.map((i) => {
          const arr = locBase.map((item) => {
            if (item[0] === i.getElement().firstElementChild.id) {
              return true;
            } else {
              return false;
            }
          });
          if (!arr.includes(true)) {
            console.log("удаление маркера");
            i.remove();
            return;
          } else {
            array.push(i);
            arrayPopups.push(i.getPopup());
            return;
          }
        });
        setMarkers(array);
        setPopups(arrayPopups);
      }
      return;
    }
    if (!map.current) return; // ожидание инициализации карты
  }, [locBase]);

  ///Запрос и обработка ответа данных по самолетам
  useEffect(() => {
    if(markers.length>0){
      markers.map((i)=>{i.remove()})
    }
    clearTimeout(time1);
    clearTimeout(time2);
    setMarkers([])
    //запрос данных с FlightRadar24 по введенным координатам
    setTime1(
      setTimeout(function work() {
        latPred = +radius / (Math.cos(+lat * (Math.PI / 180)) * 111.321377778); //Предел поиска по широте
        lonPred = +radius / 111.134861111; //Предел поиска по долготе
        locate(lat, lon, latPred, lonPred) // Запрос на сервер
          .then((res) => {
            res.map((item) => {
              item.push(Dalnost(item, lat, lon)); //Определение дальности до самолета
              item.push(Azimut(item, lat, lon)); //Определение азимута до самолета
              let trackArray = { ...track }; //Добавление координат для трека
              if (trackArray[item[0]]) {
                trackArray[item[0]].push([item[3], item[2]]);
              } else {
                trackArray[item[0]] = [];
              }
              const result = Object.assign(track, trackArray);
              setTrack(result);
            });
            return res;
          })
          //добавление в массив результатов азимута самолета
          .then((res) => {
            setLocBase(res);
          })
          .then((res) => setTime2(setTimeout(work, 1000)))
          .catch((err) => console.log(err));
        // });
      }, 1000)
    );
  }, [lat, lon, radius]);

  return (
    <div className="radar24">
      <ControlPanel
        allForms={allForms}
        lat={lat}
        lon={lon}
        clearTrack={clearTrack}
      ></ControlPanel>
      <div className="radar24__position">
        <div
          ref={mapContainer}
          className="radar24__map"
          id="666"
          width="100%"
          height="100%"
          dblclick="false"
        />
      </div>
    </div>
  );
}
export default Radar24;
