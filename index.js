require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const expressWinston = require("express-winston");
const winston = require("winston");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const connectToDb = require("./database");

const { Order } = require("./models");
const { response } = require("express");

const port = process.env.PORT;

async function createApp() {
  await connectToDb();

  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
    })
  );

  const app = express();
  // Middleware: parse the body to json
  app.use(bodyParser.json());
  // Api documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
    })
  );

  // Retrieve all orders
  app.get("/", async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  // Retrieve an order with the orderId
  app.get("/:orderId", async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) res.status(400).end();
    try {
      const order = await Order.findOne({ id: orderId });
      if (!order) {
        return res.status(404).json({ message: "Cannot find order" });
      } else {
        res.send(order);
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  // Create a new order
  app.post("/", async (req, res) => {
    const order = new Order({
      id: uuidv4(),
      product: req.body.product,
      price: req.body.price,
    });
    try {
      const newOrder = await order.save();
      res.status(201).json(newOrder);
    } catch (err) {
      res.status(400).json({ message: "Bad request" });
    }
  });

  app.delete("/:orderId", async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) res.status(400).end();
    try {
      await Order.findOneAndDelete({ id: orderId });
      res.json({ message: "The order was deleted" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/:orderId", async (req, res) => {
    const { orderId } = req.params;
    const orderToUpdate = req.body;

    if (!orderId) res.status(400).end();
    try {
      const updatedOrder = await Order.findOneAndUpdate(
        { id: orderId },
        orderToUpdate
      );
      res.json(updatedOrder);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return app;
}

createApp().then((app) => {
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  );
});
