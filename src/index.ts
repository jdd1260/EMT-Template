// You need to import aliases first in order to use absolute imports
import './config/aliases';
import { expressConfig } from '@src/config/config';

import logger from '@src/config/winston';

import { serializeError } from 'serialize-error';

import App from './app';

process.on('unhandledRejection', (r) => {
  logger.error('Unhandled Promise Rejection', serializeError(r));
});

const app = new App(expressConfig);

app.start().catch((err: Error) => {
  logger.error('Failed to start app:', { err: serializeError(err) });
});

export default app;
