import { NextFunction, Request, Response } from 'express';
import logger from '@src/config/winston';

function logError(err: Error, req: Request): void {
  logger.error(`${req.method} ${req.originalUrl}: ${err}`);
  logger.error(err.stack);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: Error, req: Request, res: Response, next: NextFunction): void => {
  switch (err.name) {
    case 'UnauthorizedError':
      res.status(401).json(err);
      break;

    default:
      logError(err, req);
      if (err.message) {
        res.status(500).json({ errors: [err.message] });
        break;
      }
      res.status(500).json(err);
      break;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const forwardError = (e: any, res: Response, next: NextFunction): void => {
  if (e.response?.status && e.response?.data) {
    // pass the response through
    res.status(e.response.status).send(e.response.data);
  } else {
    next(e);
  }
};
