import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object//
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object//
class Weather {
  city: string;
  date: string;
  description: string;
  temp: number;
  humidity: number;
  wind: number;
  uvIndex: number;
  forecast: Weather[];

  constructor(
    city: string,
    date: string,
    description: string,
    temp: number,
    humidity: number,
    wind: number,
    uvIndex: number,
    forecast: Weather[]
  ) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
    this.uvIndex = uvIndex;
    this.forecast = forecast;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties//
  private baseURL?: string;
  private apiKey: string | undefined;
  private cityName?: string;
  // TODO: Create fetchLocationData method//
  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = process.env.WEATHER_API_KEY;
    this.cityName = '';
  }


  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const response = await fetch(`${this.baseURL}geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`);
    const data = await response.json();
    return this.destructureLocationData(data[0]);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const weatherData = await response.json();
    return weatherData;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { name: city, main: { temp, humidity }, weather, wind: { speed: wind }, dt: date } = response;
    const description = weather[0].description;
    const uvIndex = 0; 
    const forecast: Weather[] = []; 

    return new Weather(city, new Date(date * 1000).toISOString(), description, temp, humidity, wind, uvIndex, forecast);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    // Implement the logic to build the forecast array
    const forecast: Weather[] = weatherData.map(data => {
      return new Weather(
        currentWeather.city,
        new Date(data.dt * 1000).toISOString(),
        data.weather[0].description,
        data.main.temp,
        data.main.humidity,
        data.wind.speed,
        0, 

        []
      );
    });
    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const locationData = await this.fetchAndDestructureLocationData();
    const coordinates = this.destructureLocationData(locationData);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData);
    console.log(forecast); // Use the forecast variable
    // Add further processing here

    return currentWeather;
  }
}

export default new WeatherService();
