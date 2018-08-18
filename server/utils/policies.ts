import * as jwt from 'express-jwt';
import * as jwtVerifier from 'jsonwebtoken';

export const token = (id: string | number) =>
  jwtVerifier.sign({ _id: id }, process.env.JWT_SECRET);

export const isLoggedIn = () =>
  jwt({
    secret: process.env.JWT_SECRET,
    getToken(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1];
      }

      return null;
    },
  });
