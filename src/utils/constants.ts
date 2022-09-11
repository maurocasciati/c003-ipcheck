import { Currency } from "src/dtos/Currency.dto";
import { coordinateToRad } from "./distance.utils";

export const API_LAYER_URL = 'https://api.apilayer.com/fixer/latest';
export const API_LAYER_KEY = 'hunX0YQfq0eVVnCtVWVipFO0tugFjxVZ';

export const IP_API_URL = 'http://ip-api.com/json/';
export const IP_API_PARAMS = 'fields=status,message,country,countryCode,lat,lon,currency,query';

export const BASE_COUNTRY = {
  code: 'USA',
  latInRad: coordinateToRad(36.2554603),
  lonInRad: coordinateToRad(-113.6628522),
  currency: {
    iso: 'USD',
    symbol: '$',
    conversion_rate: 1,
  } as Currency,
}