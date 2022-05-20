
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
    const data ={
      one: one(),
      two: two(),
      three: three(),
      four: four(),
    }
     const url = `http://45.141.77.150:8080`
      return fetch(url, {
        method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
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