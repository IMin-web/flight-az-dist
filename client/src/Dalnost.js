export default function Dalnost(item, lat1, lon1) {
    let lat2 = item[2];
    let lon2 = item[3];
    const R = 6371e3; // метры
    const φ1 = lat1 * Math.PI / 180; // φ, λ в радианах
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // в метры
    return d;
  }