import models from '../../models';
import { error, success } from '../../utils/messages';
import { isLoggedIn } from '../../utils/policies';

const get = (req, res) => {
  const { _id } = req.user;
  models.Transaction.find({ user: _id })
    .exec()
    .then(results => {
      res.json({ transactions: results });
    })
    .catch(err => res.status(500).json(error(err)));
};

const create = (req, res) => {
  const { price, description, type, category, date } = req.body;
  const { _id } = req.user;
  if (!price) {
    return res.status(403).json(error('Price cannot be empty'));
  }

  const data = {
    price,
    description,
    type,
    category: category || 'No Category',
    date: date || Date.now(),
    user: _id,
  };
  new models.Transaction(data).save();
  res.status(200).json(data);
};

const update = (where: 'body' | 'params') => (req, res) => {
  const { id } = req[where];
  const { price, description, type, category, date } = req.body;
  const { _id } = req.user;
  if (!price) {
    return res.status(403).json(error('Price cannot be empty'));
  }

  const data = {
    price,
    description,
    type,
    category: category || 'No Category',
    date,
  };
  models.Transaction.update({ _id: id, user: _id }, data);
  res.status(200).json(data);
};

const deleteOne = (where: 'body' | 'params') => (req, res) => {
  const { id } = req[where];
  const { _id } = req.user;

  models.Transaction.deleteOne({ _id: id, user: _id });
  res.status(200).json(success());
};

export default apiRouter => {
  apiRouter
    .route('/transactions')
    .get(isLoggedIn(), get)
    .post(isLoggedIn(), create)
    .put(isLoggedIn(), update('body'))
    .delete(isLoggedIn(), deleteOne('body'));

  apiRouter
    .route('/transactions/:id')
    .put(isLoggedIn(), update('params'))
    .delete(isLoggedIn(), deleteOne('params'));
};
