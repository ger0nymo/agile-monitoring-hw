import { expect } from 'chai';
import { Server } from 'socket.io';
import ioClient from 'socket.io-client';
import http from 'http';
import { startServer } from '../src/index';

describe('WebSocket server', () => {
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

  it('Client connection', (done) => {
    const client = ioClient.connect('http://localhost:3000');

    client.on('connect', () => {
      expect(client.connected).to.be.true;
      client.disconnect();
      done();
    });
  });

  it('Server to client message', (done) => {
    const client1 = ioClient.connect('http://localhost:3000');
    const client2 = ioClient.connect('http://localhost:3000');

    client1.on('connect', () => {
      client2.on('message', (msg: string) => {
        expect(msg).to.equal('Hello, world!');
        client1.disconnect();
        client2.disconnect();
        done();
      });

      client1.emit('message', 'Hello, world!');
      done();
    });
  });

  it('Client to server message', (done) => {
    const client = ioClient.connect('http://localhost:3000');

    client.on('connect', () => {
      client.emit('message', 'Hello, server!');
    });

    io.on('connection', (socket) => {
      socket.on('message', (msg: string) => {
        expect(msg).to.equal('Hello, server!');
        client.disconnect();
        done();
      });
    });
  });

  it('Client disconnection', (done) => {
    const client = ioClient.connect('http://localhost:3000');

    client.on('connect', () => {
      client.disconnect();
    });

    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        expect(socket.disconnected).to.be.true;
        done();
      });
    });
  });
});
