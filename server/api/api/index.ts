import * as express from 'express';

const apiRouter = express.Router();

require('./transaction').default(apiRouter);
require('./user').default(apiRouter);

export default apiRouter;
