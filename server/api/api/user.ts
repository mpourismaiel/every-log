import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

import { error } from '../../utils/messages';
import models from '../../models';
import { serializer } from '../../models/user';
import { isLoggedIn, token } from '../../utils/policies';

export default apiRouter => {
  apiRouter.post('/user/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json(error('Please fill all the fields'));
    }

    if (password.length < 8) {
      return res
        .status(403)
        .json(error('Password must be more than 8 characters'));
    }

    const hash = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return reject(err);
        }
        resolve(hashedPassword);
      });
    });

    new models.User({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: hash,
    })
      .save()
      .then(user => {
        res.status(200).json({
          user: serializer(user.toObject()),
          token: `Bearer ${token(user._id)}`,
        });
      })
      .catch(err => {
        if (err.code === 11000) {
          return res.status(500).json(error('This user is already registered'));
        }
        return res.status(500).json(error(err));
      });
  });

  apiRouter.post('/user/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json(error('Please fill all the fields'));
    }

    models.User.findOne({ email })
      .then((user: any) => {
        bcrypt.compare(password, user.password, err => {
          if (err) {
            return res.status(403).json(error('Email or password is invalid'));
          }

          res.status(200).json({
            user: serializer(user.toObject()),
            token: `Bearer ${token(user._id)}`,
          });
        });
      })
      .catch(err => {
        return res.status(500).json(error(err || 'User not found'));
      });
  });

  apiRouter.get('/user', isLoggedIn(), (req, res) => {
    models.User.findOne({ _id: req.user._id })
      .exec()
      .then(user => {
        res.status(200).json({ user: serializer(user.toObject()) });
      })
      .catch(err => res.status(500).json(error(err)));
  });
};
