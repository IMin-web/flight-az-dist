
  export default function locate() { //Запрос данных с FlightRadar24
    const url = 'http://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=63.9,58.4,57.5,68.7&adsb=1&air=1&array=1'
    return fetch(url, {
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      referrerPolicy: 'no-referrer'
    })
      .then(res => res.json())
      .then(res =>{return res.aircraft})
  }