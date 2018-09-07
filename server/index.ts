require('dotenv').config();
import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import registerRoutes from './api';

const app = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
registerRoutes(app);

app.listen(3001, process.env.hostname || '0.0.0.0', () => {
  console.log('CORS-enabled web server listening on port 3001');
});
