import mongoose from 'mongoose';

async function connectToDb(config) {
  await mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default connectToDb;
