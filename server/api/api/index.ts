// tslint:disable:no-console
import * as express from 'express';
import models from '../../models';
import { error, success } from '../../utils/messages';

const apiRouter = express.Router();
apiRouter.use((req, res, next) => {
  console.log(`/api${req.url}`, '- Request recieved', req.method);
  next();
});

apiRouter.route('/transaction').post((req, res) => {
  const { price, description, type, category, date } = req.body;
  if (!price) {
    return res.status(403).json(error('Price cannot be empty'));
  }

  const data = {
    price,
    description,
    type,
    category: category || 'No Category',
    date: date || Date.now(),
  };
  new models.Transaction(data).save();
  res.status(200).json(success());
});

export default apiRouter;
