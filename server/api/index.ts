import apiRouter from './api';

export default function registerRoutes(app) {
  app.use('/api', apiRouter);
}
