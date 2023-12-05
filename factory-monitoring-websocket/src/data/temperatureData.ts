import * as fs from 'fs';
import * as path from 'path';
import TemperatureData from '../models/TemperatureData';

export function readTemperatureData(): TemperatureData {
  const filePath = path.join(__dirname, 'temperatures.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData) as TemperatureData;
}
