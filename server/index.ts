// tslint:disable:no-console
import * as mongoose from 'mongoose';
import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

const mongoDB = 'mongodb://127.0.0.1:27017/everylog';
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true },
);
(mongoose.Promise as any) = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', console.log.bind('Mongodb connected'));

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

const models = {
  Transaction: TransactionModel,
};

const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

const apiRouter = express.Router();
apiRouter.use((req, res, next) => {
  console.log('/api', 'Request recieved', req.url, req.method);
  next();
});

apiRouter.route('/transaction').post((req, res) => {
  const { price, description, type, category, date } = req.body;
  if (!price) {
    return res.status(403).json({ error: 'Price cannot be empty' });
  }

  const data = {
    price,
    description,
    type,
    category: category || 'No Category',
    date: date || Date.now(),
  };
  new models.Transaction(data).save();
  res.status(200).json({ message: 'Successful' });
});

app.use('/api', apiRouter);

app.listen(3001, () => {
  console.log('CORS-enabled web server listening on port 3001');
});
