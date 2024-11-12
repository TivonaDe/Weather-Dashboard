import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // GET weather data from city name
  try {
    const weatherData = WeatherService.getWeatherForCity(req.body.city);

    // save city to search history
    HistoryService.addCity(req.body.city);

    // send weather data as response
    res.json(weatherData);
  }
  catch (error) {
    if (error instanceof Error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});
// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    // get search history
    const history = HistoryService.getCities();
    res.json(history);
  }
  catch (error) {
    res.status(500).json({ message: 'Error getting search history' });
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    // delete city from search history
    HistoryService.removeCity(req.params.id);
    res.json({ message: 'City removed from search history' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error removing city from search history' });
  }
});


export default router;
