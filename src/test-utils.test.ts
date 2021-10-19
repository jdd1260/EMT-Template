import request, { Test, SuperTest } from 'supertest';

import * as mongoose from '@src/db/mongoose';

import { expressConfig } from '@src/config/config';
import App from './app';

class TestUtils {
  server: SuperTest<Test>;

  app: App;

  constructor() {
    this.app = new App(expressConfig);
    this.server = request(this.app.express);
  }

  async start(): Promise<void> {
    await this.app.start();
  }

  async stop(): Promise<void> {
    const collections = (await mongoose.getConnection()?.db.listCollections().toArray()) || [];
    await Promise.all(
      collections
        .map(({ name }) => name)
        .map((collection) => mongoose.getConnection()?.db.collection(collection).drop()),
    );
    await this.app.close();
  }

  async clearDB(): Promise<void> {
    const collections = (await mongoose.getConnection()?.db.listCollections().toArray()) || [];
    await Promise.all(
      collections
        .map(({ name }) => name)
        .map((collection) => mongoose.getConnection()?.db.collection(collection).deleteMany({})),
    );
  }

  // generate auth token for testing as needed
  // getToken(userId: string, permissions?: string[]): string {}
}

export default new TestUtils();
