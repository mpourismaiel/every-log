import * as mongoose from 'mongoose';

const TransactionModel = mongoose.model(
  'transaction',
  new mongoose.Schema({
    category: String,
    date: Number,
    description: String,
    price: Number,
    type: String,
  }),
);

export default TransactionModel;
