import React, {useState} from "react";

export default function ControlPanel(props) {
    const latRef = React.createRef();
    const lonRef = React.createRef();
    const radius = React.createRef();
    const [controlOn, setControlOn] = useState(false)
    const [azCheck, setAzCheck] = useState(false)
    const [formCheck, setFormCheck] = useState(false)

    function getRadar() {
        if (latRef.current.value && lonRef.current.value) {
          let lat1 = +latRef.current.value;
          let lon1 = +lonRef.current.value;
          let rad1 = +radius.current.value;
          if ((lat1 >= -84) & (lon1 >= -178)) {
              props.coordinates(lat1, lon1, rad1)
          } else {
            alert("Введите верные координаты!");
          }
        } else {
          alert("Введите обе координаты!");
        }
      }
    return(
        <>
        <div className="control__panel">
        {controlOn ?
        <>
        <div className="input__radar">
          <div>
            <div>Широта</div>
          <input
            ref={latRef}
            defaultValue={props.lat}
            placeholder="Введите latitude"
            type="text"
            name="lat"
            id="lat"
            className="form"
          />
          </div>
          <div>
            <div>Долгота</div>
          <input
            ref={lonRef}
            defaultValue={props.lon}
            placeholder="Введите longitude"
            type="text"
            name="lon"
            id="lon"
            className="form"
          />
          </div>
          <div>
            <div>Радиус</div>
          <input
            ref={radius}
            defaultValue={props.radius}
            placeholder="Введите радиус поиска"
            type="text"
            name="radius"
            id="radius"
            className="form"
          />
          </div>
          <button onClick={getRadar} type="submit">
            Ввод
          </button>
        </div>
        <div>
        <div>
          <div>Азимутальный круг</div>
        <label className="switch">
          <input
            checked={azCheck}
            onChange={(e) => {
              setAzCheck(!azCheck)
              props.radarON(e)
            }}
            type="checkbox"
          />
          <span className="slider round"></span>
        </label>
        </div>
        <div>
          <div>Все формуляры</div>
        <label className="switch">
          <input
            checked={formCheck}
            onChange={(e) => {
              setFormCheck(!formCheck)
              props.allForms(e)
            }}
            type="checkbox"
          />
          <span className="slider round"></span>
        </label>
        </div>
        </div>
        </>: null}
      </div>
      <div onClick={()=>{controlOn ? setControlOn(false) : setControlOn(true)}} className="control_arrow">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/></svg>
      </div>
        </>
    )
}