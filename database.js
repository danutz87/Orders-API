import mongoose from 'mongoose';

const mongoURL = process.env.MONGO_URL;

async function connectToDb() {
  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default connectToDb;
