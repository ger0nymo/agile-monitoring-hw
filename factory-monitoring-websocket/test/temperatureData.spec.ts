import { expect } from 'chai';
import { readTemperatureData } from '../src/data/temperatureData';
import TemperatureData from '../src/models/TemperatureData';
import { Server } from 'socket.io';
import ioClient from 'socket.io-client';
import http from 'http';
import { startServer } from '../src/index';

describe('Temperature data', () => {
  let server: http.Server;
  let io: Server;

  before((done) => {
    server = startServer();
    io = new Server(server);
    server.on('listening', () => done());
  });

  after((done) => {
    io.close(() => {
      server.close(() => done());
    });
  });

  it('Read temperature data from JSON file', () => {
    const temperatureData: TemperatureData = readTemperatureData();

    expect(temperatureData).to.have.property('factoryId').that.is.a('string');
    expect(temperatureData).to.have.property('location').that.is.a('string');
    expect(temperatureData)
      .to.have.property('temperatureData')
      .that.is.an('array');
  });

  it('Should send an element of temperature data to connected clients', function (done) {
    const client = ioClient.connect('http://localhost:3000');
    const energyConsumptionData: EnergyConsumptionData =
      readEnergyConsumptionData();
    const testDataElement = energyConsumptionData.energyConsumptionData[0];

    client.on('connect', () => {
      client.on('data', (data: any) => {
        expect(data).to.deep.equal(testDataElement);
        client.disconnect();
        done();
      });

      io.emit('data', testDataElement);
    });
  });
});
