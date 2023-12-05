import { expect } from 'chai';
import { Server } from 'socket.io';
import ioClient from 'socket.io-client';
import http from 'http';
import { startServer } from '../src/index';
import { readEnergyConsumptionData } from '../src/data/energyConsumptionData';
import EnergyConsumptionData from '../src/models/EnergyConsumptionData';

describe('Energy consumption data', function () {
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

  it('Read consumption data from JSON file', () => {
    const energyConsumptionData: EnergyConsumptionData =
      readEnergyConsumptionData();

    expect(energyConsumptionData)
      .to.have.property('factoryId')
      .that.is.a('string');
    expect(energyConsumptionData)
      .to.have.property('location')
      .that.is.a('string');
    expect(energyConsumptionData)
      .to.have.property('energyConsumptionData')
      .that.is.an('array');
  });

  it('Should send an element of consumption data to connected clients', function (done) {
    const client = ioClient.connect('http://localhost:3000');
    const energyConsumptionData: EnergyConsumptionData =
      readEnergyConsumptionData();
    const testDataElement = energyConsumptionData.energyConsumptionData[0];

    client.on('connect', () => {
      client.on('energyData', (data: any) => {
        expect(data).to.deep.equal(testDataElement);
        client.disconnect();
        done();
      });

      io.emit('energyData', testDataElement);
    });
  });
});
