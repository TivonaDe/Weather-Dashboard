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
  private apiKey?: string;
  private cityName?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
 // TODO: Create fetchLocationData method//
  private async fetchLocationData(query: string) {
  try {
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`Failed to fetch location data for city: ${this.cityName}`);
    }
    const data = await response.json();
    return { lat: data[0].lat, lon: data[0].lon };
  } catch (err) {
    console.error('Error fetching location data', err);
    throw err;
  }
}
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) {
      throw new Error('Location data must be defined');
    }
    const { lat, lon } = locationData;
    return { lat, lon };
    };
  };
   // Create buildGeocodeQuery method
   private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(this.cityName!)}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    try {
      const geocodeURL = this.buildGeocodeQuery();
      const locationData = await this.fetchLocationData(geocodeURL);
      const coordinates = this.destructureLocationData(locationData);
      return coordinates;
    } catch (err) {
      console.log('Error in fetchAndDestructureLocationData:', err);
      throw err;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const weatherQuery = this.buildWeatherQuery(coordinates);
      const response = await fetch(weatherQuery);
      if (!response.ok) {
        return `Failed to fetch weather data for ${this.cityName}`;
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.log('Error in fetchWeatherData:', err);
      throw err;
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(weatherData: any[]): Weather {
    const currentWeather = weatherData[0];
    return new Weather(
      this.cityName!,
      new Date(currentWeather.dt * 1000).toISOString(),
      currentWeather.weather[0].description,
      currentWeather.main.temp,
      currentWeather.main.humidity,
      currentWeather.wind.speed,
      0,
      []
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecast = weatherData.slice(1, 6).map((forecastItem) => {
      return new Weather(
        this.cityName!,
        new Date(forecastItem.dt * 1000).toISOString(),
        forecastItem.weather[0].description,
        forecastItem.main.temp,
        forecastItem.main.humidity,
        forecastItem.wind.speed,
        0,
        []
      );
    });
    currentWeather.forecast = forecast;
    return forecast;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    try {
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastWeather = this.buildForecastArray(currentWeather, weatherData.list);
      const completeWeather = [currentWeather, ...forecastWeather];
      return completeWeather;
    } catch (err) {
      console.error(`Error in getWeatherForCity for ${city}:`, err);
      throw err;
    }
  }
}
 

export default new WeatherService();
