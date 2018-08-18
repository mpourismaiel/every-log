import * as express from 'express';

const apiRouter = express.Router();
apiRouter.use((req, res, next) => {
  console.log(`/api${req.url}`, '- Request recieved', req.method);
  next();
});

require('./transaction').default(apiRouter);
require('./user').default(apiRouter);

export default apiRouter;
