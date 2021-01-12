import request from 'supertest';
import createApp from '../createApp.js';
import mongoServer from 'mongodb-memory-server';
import mongoose from 'mongoose';


let app, config, mongod;

beforeAll(async () => {
  mongod = await new mongoServer.MongoMemoryServer();
  config = {
    MONGO_URL: await mongod.getUri(),
  };
  app = await createApp(config);
});

afterAll(async () => {
  // after some useful code don't forget to disconnect
  await mongoose.disconnect();
  // you may stop mongod manually
  await mongod.stop();
});

describe('API Tests', () => {
  it('Creates a new order', (done) => {
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
        expect(res.body.price).toEqual(4)
        done();
      });
  });
});
