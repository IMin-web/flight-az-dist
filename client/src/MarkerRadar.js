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

function colorMarker(item) {
    let color = {
      'transform': `rotate(${item-90}deg)`,
    }
    return color
  }

  return (
    <>
      {locBase.map((item) => (
              <Marker className="radar24__marker" onClick={()=>tablePosition(item)} anchor="bottom"  key={item[0]} latitude={item[2]} longitude={item[3]}>
                <svg onClick={(e) => props.onMarkerClick(item, e)} className="radar24__marker__svg" style={colorMarker(item[4])} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M482.3 192C516.5 192 576 221 576 256C576 292 516.5 320 482.3 320H365.7L265.2 495.9C259.5 505.8 248.9 512 237.4 512H181.2C170.6 512 162.9 501.8 165.8 491.6L214.9 320H112L68.8 377.6C65.78 381.6 61.04 384 56 384H14.03C6.284 384 0 377.7 0 369.1C0 368.7 .1818 367.4 .5398 366.1L32 256L.5398 145.9C.1818 144.6 0 143.3 0 142C0 134.3 6.284 128 14.03 128H56C61.04 128 65.78 130.4 68.8 134.4L112 192H214.9L165.8 20.4C162.9 10.17 170.6 0 181.2 0H237.4C248.9 0 259.5 6.153 265.2 16.12L365.7 192H482.3z"/></svg>
                <div onClick={(e) => props.onMarkerClick(item, e)} className="marker__name">{item[17] || "Без названия"}</div>
                 {form === item[0] || props.allFormsOn ? (
                   <>
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
                  </>
                ) : null} 
              </Marker>
              
            ))}
    </>
  );
}
