import cors from 'cors';
import express, { Request } from 'express';
import bodyParser from 'body-parser';
import { serializeError } from 'serialize-error';
import morgan from 'morgan';
import { Server } from 'http';
import errors from '@src/middleware/errors';
import notFound from '@src/middleware/notFound';
import logger, { LoggerStream } from '@src/config/winston';
import openRoutes from '@src/routes/unsecured';
import { expressConfig, ExpressConfig, verifyConfig } from '@src/config/config';
import { connect, disconnect } from '@src/db/mongoose';

function configureCors(req: Request, callback: (err: Error | null, options?: cors.CorsOptions) => void): void {
  const options = {
    origin: req.header('Origin') || '*',
    credentials: true,
  };
  callback(null, options);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // any fields you want available on the request object
    // export interface Request {}
  }
}

export default class App {
  private config: ExpressConfig;

  server: Server | null;

  express: express.Express;

  constructor(config: ExpressConfig) {
    this.config = config;
    this.express = express();
    this.server = null;
  }

  async configure(): Promise<void> {
    await connect();
    this.middleware();
    this.routes();
    this.errors();
  }

  errors(): void {
    this.express.use(errors);
    this.express.use(notFound); // always last
  }

  listen(startedAt: Date): Promise<void> {
    const { port } = this.config;
    return new Promise((resolve) => {
      this.server = this.express.listen(port, () => {
        if (!expressConfig.limitLogs) {
          const finishedAt = new Date();
          const startupTimeSeconds = (finishedAt.getTime() - startedAt.getTime()) / 1000;
          logger.info(`Listening on port ${port}`);
          logger.info(`Startup time was ${startupTimeSeconds} seconds`);
        }
        resolve();
      });
    });
  }

  async close(): Promise<void> {
    if (this.server) {
      this.server.close();
    }
    await disconnect();
  }

  middleware(): void {
    this.express.use(cors(configureCors));
  }

  routes(): void {
    this.express.options('*', cors(configureCors)); // enable preflight

    // log API requests
    if (!expressConfig.limitLogs) {
      this.express.use(
        morgan('combined', {
          stream: new LoggerStream(),
          skip(req) {
            return req.path === '/healthz';
          },
        }),
      );
    }

    this.express.use(bodyParser.json()); // for parsing application/json

    // set up unsecured routes before auth middleware
    this.express.use('/api/v1', openRoutes);
  }

  async start(): Promise<void> {
    try {
      const startedAt = new Date();
      verifyConfig();
      await this.configure();
      await this.listen(startedAt);
    } catch (err) {
      logger.error('Error starting app: ', serializeError(err));
    }
  }
}
