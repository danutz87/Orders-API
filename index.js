require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const expressWinston = require("express-winston");
const winston = require("winston");

const connectToDb = require("./database");

const { Order } = require("./models");

const port = process.env.PORT;

async function createApp() {
  await connectToDb();

  const app = express();

  app.use(bodyParser.json());

  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
    })
  );

  app.get("/", async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/:id", getOrder, (req, res) => {
    res.send(res.order);
  });

  app.post("/", async (req, res) => {
    const order = new Order({
      id: req.body.id,
      product: req.body.product,
      price: req.body.price,
    });

    try {
      const newOrder = await order.save();
      res.status(201).json(newOrder);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  async function getOrder(req, res, next) {
    let order;
    try {
      order = await Order.findById(req.params.id);
      if (order == null) {
        return res.status(404).json({ message: "Cannot find order" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.order = order;
    next();
  }

  return app;
}

createApp().then((app) => {
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  );
});
