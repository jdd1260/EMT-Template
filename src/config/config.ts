import dotenv from 'dotenv';
import _ from 'lodash';

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const { PORT, MONGODATABASE, MONGOHOST, MONGOPASSWORD, MONGOPORT, MONGOUSER, MONGOCONNECTIONSTRING, ENV } =
  process.env || {};

export interface MongoConfig {
  mongoHost: string;
  mongoPort: string;
  mongoDatabase: string;
  mongoUser: string;
  mongoPassword: string;
  mongoConnectionString: string;
}

export const mongoConfig: MongoConfig = {
  mongoDatabase: MONGODATABASE || '',
  mongoHost: MONGOHOST || '',
  mongoPassword: MONGOPASSWORD || '',
  mongoPort: MONGOPORT || '',
  mongoUser: MONGOUSER || '',
  mongoConnectionString: process.env.MONGO_URL || MONGOCONNECTIONSTRING || '',
};

export interface ExpressConfig {
  port: number;
  env: string;
  limitLogs: boolean;
}

export const expressConfig: ExpressConfig = {
  port: Number(PORT) || 4000,
  env: ENV || 'dev',
  limitLogs: process.env.NODE_ENV === 'test',
};

// freeze environment in live server, but allow changes for testing purposes
if (process.env.NODE_ENV !== 'test') {
  Object.freeze(expressConfig);
}

export function verifyConfig(): void {
  // do not require values in local development
  if (expressConfig.env !== 'dev') {
    _.forEach(exports, (config, configName) => {
      // allow empty values in mongoConfig because they will
      // cause the mongo connection to fail in an obvious way
      if (configName !== 'mongoConfig') {
        _.forEach(config, (val, field) => {
          if (_.isNil(val)) {
            throw new Error(`Missing configuration for ${configName}.${field}`);
          }
        });
      }
    });
  }
}
