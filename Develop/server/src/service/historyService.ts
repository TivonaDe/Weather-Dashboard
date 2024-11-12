import fs from 'node:fs/promises';
import {v4 as uuidv4} from 'uuid';


// Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const data = await fs.readFile('searchHistory.json', 'utf-8');
    return JSON.parse(data) as City[];
  }

  private async write(cities: City[]) {
    await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, 2));
  }

  async getCities() {
    try {
      return await this.read();
    } catch (error) {
      return [];
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.getCities();
    const newCity = new City(city);
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.getCities();
    const filteredCities = cities.filter(city => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();
