import mongoose from 'mongoose';

export const Order = mongoose.model('Order', {
  id: String,
  product: String,
  price: Number,
});
