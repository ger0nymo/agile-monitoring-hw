import { Server } from 'socket.io';
import http from 'http';

import { readTemperatureData } from './data/temperatureData';
import { readEnergyConsumptionData } from './data/energyConsumptionData';

const temperatureData = readTemperatureData();
const energyConsumptionData = readEnergyConsumptionData();

export function startServer(): http.Server {
  const server = http.createServer();
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    let sentIdx = 5;
    for (let i = 0; i < sentIdx; i++) {
      const temperatureDataElement = temperatureData.temperatureData[i];
      const energyConsumptionDataElement =
        energyConsumptionData.energyConsumptionData[i];

      socket.emit('data', temperatureDataElement);
      socket.emit('data', energyConsumptionDataElement);
    }
    setInterval(() => {
      const temperatureDataElement = temperatureData.temperatureData[sentIdx];
      const energyConsumptionDataElement =
        energyConsumptionData.energyConsumptionData[sentIdx];

      sentIdx = (sentIdx + 1) % temperatureData.temperatureData.length;

      socket.emit('data', temperatureDataElement);
      socket.emit('data', energyConsumptionDataElement);
    }, 10000);

    // Custom event: 'data'
    socket.on('data', (data) => {
      // Broadcast the data to all connected users
      io.emit('data', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  const PORT = process.env.PORT || 3001;

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  return server;
}

if (require.main === module) {
  startServer();
}
