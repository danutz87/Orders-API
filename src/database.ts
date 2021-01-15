import mongoose from 'mongoose';

async function connectToDb(config: { MONGO_URL: string; }) {
  await mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

export default connectToDb;
