   function toRadians(degrees) {
    return degrees * Math.PI / 180;
  };

  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  }

  export default function Azimut(item, lat1, lon1) {
    let startLat = lat1;
    let startLng = lon1;
    let destLat = item[2]
    let destLng = item[3]

    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
  }