import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema({id: String,
  product: String,
  price: Number
})

export const Order = mongoose.model('Order', orderSchema);
