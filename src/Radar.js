import React from "react";
import './Radar.css'

export default function Radar() {
  const d = 300;
    let dalnost = [];
    for (let i = 0; i < d; i + 10) {
      i += 10;
      dalnost.push(i);
    }
    let azimut = [];
    for (let i = 0; i < 180; i + 10) {
      i += 10;
      azimut.push(i);
    }
  
  return(
        <>
                  <div className="range">
                    {dalnost.map((item) => (
                      <>
                      {item%50 ?
                      <div
                        key={item}
                        style={{
                          width: `${item * 3}px`,
                          height: `${item * 3}px`,
                          borderWidth: "1px",
                        }}
                      ></div>
                      : <div
                      key={item}
                      style={{
                        width: `${item * 3}px`,
                        height: `${item * 3}px`,
                        borderWidth: "2px",
                      }}
                    ></div>
                    }
                      </>
                      
                    ))}
                  </div>
                  <div className="azimut">
                    {azimut.map((item) => (
                      <>
                      {item%30 ? 
                      <div
                      key={item}
                      style={{
                        transform: `rotate(${item}deg)`,
                        borderWidth: "1px",
                        borderTop: "1px solid rgb(124, 124, 124, 0.568)",
                      }}
                    ></div>
                    :
                    <div
                      key={item}
                      style={{
                        transform: `rotate(${item}deg)`,
                        borderWidth: "1px",
                        borderTop: "2px solid rgb(124, 124, 124, 0.568)",
                      }}
                    ></div>
                  }
                  </>
                  ))}
                  </div>
                </>
    )
}