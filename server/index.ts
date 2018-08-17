// tslint:disable:no-console
import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import registerRoutes from './api';

const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

registerRoutes(app);

app.listen(3001, () => {
  console.log('CORS-enabled web server listening on port 3001');
});
