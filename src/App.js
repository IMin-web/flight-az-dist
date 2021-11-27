import { useState, useEffect } from "react";
import React from "react";


function App() {
  const [base, setBase] = useState(' ');
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')

  let nameInput = React.createRef()

  useEffect(() => {
    if (name){
    fetch(`./fetch/data/${name}.json`)
      .then(response => response.json())
      .then(text => setBase(text))
      .then(response => setShow(true))
    }else{
      alert('Введите номер самолета')
    }
  })

    return (
      <div>
        <input ref={nameInput}></input>
        <button onClick={()=>setName(nameInput.current.value)}>Parsing</button>
        {show && 
        <div>
          <p>{base.features[0].properties.pop().number}</p>
          <p>{base.features[0].geometry.coordinates.pop()}</p>
          <p>{base.features[0].properties.pop().altitude.meters}</p>
          <p>{base.features[0].properties.pop().speed.kmh}</p>
          <p>{base.features[0].properties.pop().heading}</p>
        </div>
        }
      </div>
    );
  }

  export default App;
