import { useState} from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax



  // function addTrack(item) {
  //   const track = document.createElement("div");
  //   track.className = "radar24__track";
  //   const trackPoint = new mapboxgl.Marker(track)
  //     .setLngLat([item[3], item[2]])
  //     .addTo(map.current);
  // }

  export default function MarkerRadar(locBase, map) {
    const [markers, setMarkers] = useState([]);

    function addMarker(item, array, map) {
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
  
    function addPopup(item) {
      return `<p>Азимут: ${Math.round(item[20])}</p>
        <p>Дальность: ${Math.round(item[19] / 100) / 10}</p>
        <p>Высота: ${Math.round(item[5] / 0.33) / 10}</p>
        <p>Скорость: ${Math.round(item[6] * 1.87)}</p>
        <p>Курс: ${item[4]}</p>`;
    }
    
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
            addMarker(item, array, map);
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
              addMarker(item, array, map);
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
  }
  