import { useState} from "react";
import { Marker} from "react-map-gl";

export default function MarkerRadar(props) {
    const lat=props.lat;
    const lon=props.lon;
    const locBase=props.locBase;
    const form=props.form;
    
  const [tablePos, setTablePos] = useState();

  function tablePosition(item){
    if (item[2] > lat) {
      if (item[2] > lon) {
        setTablePos({ right: "10px", top: "10px" });
      } else {
        setTablePos({ left: "10px", top: "10px" });
      }
    } else {
      if (item[3] > lon) {
        setTablePos({ right: "10px", bottom: "10px" });
      } else {
        setTablePos({ left: "10px", bottom: "10px" });
      }
    }
  };

  return (
    <>
      {locBase.map((item) => (
              <Marker className="radar24__marker" onClick={()=>tablePosition(item)} anchor="bottom"  key={item[0]} latitude={item[2]} longitude={item[3]}>
                <div onClick={(e) => props.onMarkerClick(item, e)} className="marker__name">{item[17] || "Без названия"}</div>
                 {form === item[0] ? (
                  <div
                    onClick={(e) => props.onMarkerClick(item, e)}
                    key={item[0]}
                    className="marker__table"
                    style={tablePos}
                  >
                    <p>Азимут: {Math.round(item[20])}</p>
                    <p>Дальность: {Math.round(item[19] / 100) / 10}</p>
                    <p>Высота: {Math.round(item[5] / 0.33) / 10}</p>
                    <p>Скорость: {Math.round(item[6] * 1.87)}</p>
                    <p>Курс: {item[4]}</p>
                  </div>
                ) : null} 
              </Marker>
            ))}
    </>
  );
}
