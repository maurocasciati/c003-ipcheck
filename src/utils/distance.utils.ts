import { BASE_COUNTRY } from './constants';

export const getDistanteToBaseCountry = (lat: number, lon: number): number => {
  const fromLatInRad = coordinateToRad(lat);
  const fromLonInRad = coordinateToRad(lon);
  const toLatInRad = BASE_COUNTRY.latInRad;
  const toLonInRad = BASE_COUNTRY.lonInRad;

  return (
    6377.830272 * // Earth's radius in km
    Math.acos(
      Math.sin(fromLatInRad) * Math.sin(toLatInRad) +
        Math.cos(fromLatInRad) * Math.cos(toLatInRad) * Math.cos(toLonInRad - fromLonInRad),
    )
  );
}

export const coordinateToRad = (coordinate: number): number => {
  return (coordinate * Math.PI) / 180;
}