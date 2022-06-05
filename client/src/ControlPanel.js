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
        <div>
          <div>Удалить треки без самолетов
          </div>
          <button onClick={()=>props.clearTrack()}>Delete</button>
        </div>
      </div>

        </>
    )
}