interface TemperatureData {
  factoryId: string;
  location: string;
  temperatureData: TemperatureEntry[];
}

interface TemperatureEntry {
  timestamp: string;
  temperature: number;
}

export default TemperatureData;
