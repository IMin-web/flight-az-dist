export function defaultColorMarker(item) {
    let color = {
      'fill': 'black',
      // 'transform': `rotate(${item}deg)`
    }
    return color
  }

export function selectColorMarker(item) {
    let color = {
      'fill': 'red',
      // 'transform': `rotate(${item}deg)`,
      'animation-name': 'bounce',
      'animation-duration': '0.5s',
    }
    return color
  }
