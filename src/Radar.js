import { useEffect } from 'react';
import './Radar.css'

export default function radar() {


    let d10 =[[0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],[30]]
for(let i = 1; i < d10[0].length; i++){let wi = d10[1][i-1]+30;d10[1].push(wi)}

let d50 = [[0, 1, 2, 3, 4, 5],[150]]
for(let i = 1; i < d50[0].length; i++){let wi = d50[1][i-1]+150;d50[1].push(wi)}

let d100 = [[0, 1, 2],[300]]
for(let i = 1; i < d100[0].length; i++){let wi = d100[1][i-1]+300;d100[1].push(wi)}

let az10 = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],[0]]
for(let i = 1; i < az10[0].length; i++){let wi = az10[1][i-1]+10;az10[1].push(wi)}

let az30 = [[0, 1, 2, 3, 4, 5],[0]]
for(let i = 1; i < az30[0].length; i++){let wi = az30[1][i-1]+30;az30[1].push(wi)}
    return(
        <>
        <div className="range">
        {d10[0].map(item => (<div key={item} style={{ 'width': `${d10[1][item]}px`, 'height': `${d10[1][item]}px`, borderWidth: '1px' }}></div>))}
          {d50[0].map(item => (<div key={item}  style={{ 'width': `${d50[1][item]}px`, 'height': `${d50[1][item]}px`, borderWidth: '2px' }}></div>))}
          {d100[0].map(item => (<div key={item}  style={{ 'width': `${d100[1][item]}px`, 'height': `${d100[1][item]}px`, borderWidth: '3px' }}></div>))}
        </div>
        <div className="azimut">
        {az10[0].map(item => (<div key={item}  style={{ transform: `rotate(${az10[1][item]}deg)`, borderWidth: '1px', borderTop: '1px solid rgb(124, 124, 124, 0.568)' }}></div>))}
          {az30[0].map(item => (<div key={item}  style={{ transform: `rotate(${az30[1][item]}deg)`, borderWidth: '1px', borderTop: '1px solid rgb(0, 0, 0)' }}></div>))}
        </div>
 </>
    )
}