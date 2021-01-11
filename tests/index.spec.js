import request from 'supertest';
import createApp from '../createApp.js';
import * as mongoServer from 'mongodb-memory-server';
import mongoose from 'mongoose';

const mongod = new mongoServer.default.default();

let app, config;

beforeAll(async () => {
  const uri = await mongod.getUri();
  config = {
    MONGO_URL: '',
  };
  app = await createApp(config);
});

afterAll(async () => {
  // you may stop mongod manually
  await mongod.stop();
  // after some useful code don't forget to disconnect
  await mongoose.disconnect();
});

describe('API Tests', () => {
  it('Creates a new order', () => {
    request(app)
      .post('/order')
      .send({
        product: 'Bread',
        price: 5,
      })
      .expect('Content-Type', /json/)
      // .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        // console.log(res);
      });
  });
});
