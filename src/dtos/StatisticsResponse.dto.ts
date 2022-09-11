export class StatisticsResponse {
  longest_distance: CountryValue
  most_traced: CountryValue
}

export class CountryValue {
  country: string
  value: number
}
