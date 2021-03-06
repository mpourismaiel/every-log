// tslint:disable:no-console
import * as mongoose from 'mongoose';
import TransactionModel from './transaction';
import UserModel from './user';

const mongoDB = `mongodb://${process.env.MONGODB_USERNAME &&
  `${process.env.MONGODB_USERNAME}:${
    process.env.MONGODB_PASSWORD
  }@`}127.0.0.1:27017/everylog`;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true },
);
(mongoose.Promise as any) = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', console.log.bind('Mongodb connected'));

const models = {
  Transaction: TransactionModel,
  User: UserModel,
};

export default models;
