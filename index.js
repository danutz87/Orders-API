if (process.env.NODE_ENV == 'development') {
  import 'dotenv/config.js';
}

import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

import expressWinston from 'express-winston';
import winston from 'winston';

import { serve, setup } from 'swagger-ui-express';
import Yaml from 'yamljs';
const swaggerDocument = Yaml.load('./swagger.yaml');

import connectToDb from './database.js';

import { Order } from './models.js';
import logger, { productionLoggerConfig, developmentLoggerConfig } from './utils/logger.js';

const port = process.env.PORT;

async function createApp() {
  await connectToDb();

  const app = express();

  if (process.env.NODE_ENV == 'production') {
    app.use(expressWinston.logger(productionLoggerConfig));
  } else {
    app.use(expressWinston.logger(developmentLoggerConfig));
  }
  // Middleware: parse the body to json
  app.use(bodyParser.json());

  // Api documentation
  app.use('/api-docs', serve, setup(swaggerDocument));

  // Retrieve all orders
  app.get('/', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      logger.error({ message: err.toString() });
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  // Retrieve an order with the orderId
  app.get('/:orderId', async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) res.json({ message: 'Order not found' });
    try {
      const order = await Order.findOne({ id: orderId });
      if (!order) {
        return res.status(404).json({ message: 'Cannot find order' });
      } else {
        res.json(order);
      }
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  // Create a new order
  app.post('/', async (req, res) => {
    const order = new Order({
      id: uuidv4(),
      product: req.body.product,
      price: req.body.price,
    });
    try {
      const newOrder = await order.save();
      res.status(201).json(newOrder);
    } catch (err) {
      res.status(500).json({ message: 'Bad request' });
    }
  });

  app.delete('/:orderId', async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) res.status(400).end();
    try {
      await Order.findOneAndDelete({ id: orderId });
      res.json({ message: 'The order was deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const orderToUpdate = req.body;

    if (!orderId) res.status(400).end();
    try {
      const updatedOrder = await Order.findOneAndUpdate({ id: orderId }, orderToUpdate);
      res.json(updatedOrder);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return app;
}

createApp().then((app) => {
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
});
