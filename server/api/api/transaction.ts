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
  models.Transaction.create(data)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(error(err)));
};

const update = (where: 'body' | 'params') => (req, res) => {
  const { price, description, type, category, date } = req.body;
  if (!price) {
    return res.status(403).json(error('Price cannot be empty'));
  }

  const query = { _id: req[where]._id, user: req.user._id };
  const data = { price, description, type, category, date };
  models.Transaction.findOneAndUpdate(query, data, { new: true })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => res.status(500).json(error(err)));
};

const deleteOne = (where: 'body' | 'params') => (req, res) => {
  const query = { _id: req[where]._id, user: req.user._id };
  models.Transaction.findOneAndRemove(query)
    .exec()
    .then(res.status(200).json(success()))
    .catch(err => res.status(500).json(error(err)));
};

export default apiRouter => {
  apiRouter
    .route('/transactions')
    .get(isLoggedIn(), get)
    .post(isLoggedIn(), create)
    .put(isLoggedIn(), update('body'))
    .delete(isLoggedIn(), deleteOne('body'));

  apiRouter
    .route('/transactions/:_id')
    .put(isLoggedIn(), update('params'))
    .delete(isLoggedIn(), deleteOne('params'));
};
