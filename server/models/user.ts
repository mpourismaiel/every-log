import * as mongoose from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  password: string;
}

const UserModel = mongoose.model(
  'user',
  new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  }),
);

export const serializer = (model: IUser) => {
  const data = { ...model };
  delete data.password;
  return data;
};

export default UserModel;
