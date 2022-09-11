import { Currency } from "./Currency.dto"

export class TracesResponse {
  ip: string
  name: string
  code: string
  lat: number
  lon: number
  currencies: Currency[]
  distance_to_usa: number
}
