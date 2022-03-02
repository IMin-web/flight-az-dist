import React from "react";

export default function ControlPanel(props) {
    const latRef = React.createRef();
    const lonRef = React.createRef();

    function getRadar() {
        if (latRef.current.value && lonRef.current.value) {
          let lat1 = +latRef.current.value;
          let lon1 = +lonRef.current.value;
          if ((lat1 >= -84) & (lon1 >= -178)) {
              props.coordinates(lat1, lon1)
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
        <div className="input__radar">
          <input
            ref={latRef}
            defaultValue={0}
            placeholder="Введите latitude"
            type="text"
            name="lat"
            id="lat"
            className="form"
          />
          <input
            ref={lonRef}
            defaultValue={0}
            placeholder="Введите longitude"
            type="text"
            name="lon"
            id="lon"
            className="form"
          />
          <button onClick={getRadar} type="submit" className="btn">
            Ввод
          </button>
        </div>
        <label class="switch">
          <input
            onChange={(e) => {
              props.radarON(e)
            }}
            type="checkbox"
          />
          <span class="slider round"></span>
        </label>
      </div>
        </>
    )
}