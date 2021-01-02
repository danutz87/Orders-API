require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const expressWinston = require("express-winston");
const winston = require("winston");

const connectToDb = require("./database");

const { Order } = require("./models");
const { response } = require("express");

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

  app.get("/:id", (req, res) => {
    const { orderId } = req.params;
    try {
      const order = Order.findOne({ id: orderId });
      if (!order) {
        return res.status(404).json({ message: "Cannot find order" });
      } else {
        res.send(order);
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });

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
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/:id", async (req, res) => {
    const { orderId } = req.params;
    try {
      await Product.findOneAndDelete({ id: orderId });
      res.json({ message: "The order was deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/:id", async (req, res) => {
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
      res.status(500).json({ message: err.message });
    }
  });

  return app;
}

createApp().then((app) => {
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  );
});
