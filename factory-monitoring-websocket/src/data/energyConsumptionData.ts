import * as fs from 'fs';
import * as path from 'path';
import EnergyConsumptionData from '../models/EnergyConsumptionData';

export function readEnergyConsumptionData(): EnergyConsumptionData {
  const filePath = path.join(__dirname, 'energyConsumption.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData) as EnergyConsumptionData;
}
