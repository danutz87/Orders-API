import mongoose, { Document, Model } from 'mongoose';
interface OrderDocument extends Document {
  product: string,
  id: string,
  price: Number,
  _id: string
}

const orderSchema = new mongoose.Schema({
  id: String,
  product: String,
  price: Number
})

export const Order= mongoose.model<OrderDocument, Model<OrderDocument>>('Order', orderSchema);
