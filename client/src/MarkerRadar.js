import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

  /// Добавление маркера
export function addMarker(map, item, arrayMarkers, arrayPopup, track) {
  const popup = new mapboxgl.Popup({
    offset: 25,
  })
    .setHTML(addPopup(item))
    .addClassName("marker__table")
    console.log(map.current.getLayer(`${item[0]}`))
        if(!map.current.getLayer(`${item[0]}`)){
        map.current.addSource(`${item[0]}`, {
          'type': 'geojson',
          'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
          'type': 'LineString',
          'coordinates': track[item[0]],
          }
          }
          });
        map.current.addLayer({
        'id': `${item[0]}`,
        'type': 'line',
        'source': `${item[0]}`,
        'layout': {
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': '#888',
        'line-width': 5
        }
        });
      }
      else{console.log('такой трек уже есть')}
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
    .addTo(map.current)
  arrayMarkers.push(marker);
  arrayPopup.push(popup);
}
  
  /// Добавление формуляра маркеру
    export function addPopup(item) {
      return `<p>Азимут: ${Math.round(item[20])}</p>
        <p>Дальность: ${Math.round(item[19] / 100) / 10}</p>
        <p>Высота: ${Math.round(item[5] / 0.33) / 10}</p>
        <p>Скорость: ${Math.round(item[6] * 1.87)}</p>
        <p>Курс: ${item[4]}</p>`;
    }
    