import models from '../../models';
import { error } from '../../utils/messages';
import { isLoggedIn } from '../../utils/policies';

export default apiRouter => {
  const transactions = apiRouter.route('/transactions');
  transactions
    .get(isLoggedIn(), (req, res) => {
      const { _id } = req.user;
      models.Transaction.find({ user: _id })
        .exec()
        .then(results => {
          res.json({ transactions: results });
        })
        .catch(err => res.status(500).json(error(err)));
    })
    .post(isLoggedIn(), (req, res) => {
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
    });
};
