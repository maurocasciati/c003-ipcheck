export class TracesResponse {
  ip: string
  name: string
  code: string
  lat: number
  lon: number
  currencies: Currency[]
  distance_to_usa: number
}

export class Currency {
  iso: string
  symbol: string
  conversion_rate: number
}
