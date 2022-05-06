
  export default async function locate(lat, lon, latPred, lonPred) { //Запрос данных с FlightRadar24
    function one(){if(+lat+lonPred >= 90){
      return 90
    }      else{
      return +lat+lonPred;
    }}
    function two(){if(+lon-latPred <= -180){
      return -180
    }      else{
      return +lon-latPred;
    }}
    function three(){if(+lat-lonPred <= -90){
      return -90
    }      else{
      return +lat-lonPred;
    }
  }
    function four(){if(+lon+latPred >= 180){
      return 180
    }
      else{
        return +lon+latPred;
      }
    }
    // console.log(`http://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=${one()},${two()},${three()},${four()}&adsb=1&air=1&array=1`
    // )
    const url = `http://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=${one()},${two()},${three()},${four()}&adsb=1&air=1&array=1`
      return fetch(url, {
      redirect: 'follow',
      referrer: 'no-referrer',
      referrerPolicy: 'no-referrer',
    })
      .then(res => {return res.json()})
      .then(res =>{return res.aircraft})
      .catch(err => 
        {console.log('error locate')
        // alert(
        //   "Ошибка!",
        //   "Проверьте подключение к интернету и перезагрузите приложение.",
        //   [
        //     {
        //       text: "Отмена",
        //       style: "cancel",
        //     },
        //     { text: "Перезагрузка", onPress: () => window.location.reload()}
        //   ,
        //   ]
        // )
      }
      )
    }