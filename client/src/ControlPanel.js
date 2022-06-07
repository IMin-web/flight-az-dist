import React, {useState} from "react";

export default function ControlPanel(props) {
    const [formCheck, setFormCheck] = useState(false)
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
          <button className="btn-radar"onClick={()=>props.clearTrack()}>Delete</button>
        </div>
      </div>

        </>
    )
}