import * as mongoose from 'mongoose';

const TransactionModel = mongoose.model(
  'transaction',
  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    category: String,
    date: Number,
    description: String,
    price: Number,
    type: String,
  }),
);

export default TransactionModel;
