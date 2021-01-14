import request from 'supertest';
import * as createApp from '../createApp';
import {MongoMemoryServer}  from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Express } from 'express-serve-static-core';

let app: Express, config: { MONGO_URL: any; }, mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = new MongoMemoryServer();
  config = {
    MONGO_URL: await mongod.getUri(),
  };
  app = await createApp.default(config);
});

afterAll(async () => {
  // after some useful code don't forget to disconnect
  await mongoose.disconnect();
  // you may stop mongod manually
  await mongod.stop();
});

describe('API Tests', () => {
  test('Creates a new order', (done) => {
    request(app)
      .post('/order')
      .send({
        product: 'Bread',
        price: 5,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.body.product).toEqual('Bread')
        expect(res.body.price).toEqual(5)
        done();
      });
  });
});


