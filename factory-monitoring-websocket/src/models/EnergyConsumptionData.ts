interface EnergyConsumptionData {
  factoryId: string;
  location: string;
  energyConsumptionData: EnergyConsumptionEntry[];
}

interface EnergyConsumptionEntry {
  timestamp: string;
  energyConsumed: number;
}

export default EnergyConsumptionData;
