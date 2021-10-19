import mongoose, { Connection } from 'mongoose';
import logger from '@src/config/winston';
import { expressConfig, mongoConfig } from '@src/config/config';

if (!expressConfig.limitLogs) {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB is connected');
  });
}

mongoose.connection.on('error', (err) => {
  logger.error(`Could not connect to MongoDB because of ${err}`);
  process.exit(-1);
});

export const connect = async (): Promise<Connection> => {
  let connectionString = mongoConfig.mongoConnectionString;

  if (!connectionString) {
    const connectionType = mongoConfig.mongoHost === 'localhost' ? 'mongodb' : 'mongodb+srv';
    const userNameAndPassword = mongoConfig.mongoUser
      ? `${mongoConfig.mongoUser}:${mongoConfig.mongoPassword}@`
      : '';
    connectionString = `${connectionType}://${userNameAndPassword}${mongoConfig.mongoHost}/${mongoConfig.mongoDatabase}?retryWrites=true&w=majority`;
  }

  if (!expressConfig.limitLogs) {
    logger.info(`Connecting to MongoDB with: ${connectionString.replace(/(?<=:)([^/].*?)(?=@)/, '***********')}`);
  }

  await mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false, // https://mongoosejs.com/docs/deprecations.html#findandmodify
  });

  return mongoose.connection;
};

export const disconnect = async (): Promise<void> => {
  await mongoose.disconnect();
  await mongoose.connection.close();
};

export const getConnection = (): Connection => {
  return mongoose.connection;
};
