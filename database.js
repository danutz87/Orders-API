const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URL;

async function connectToDb() {
  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectToDb;
