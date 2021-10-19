import TestUtils from '@src/test-utils.test';

describe('/admin', () => {
  beforeAll(async () => await TestUtils.start());
  afterAll(async () => await TestUtils.stop());

  describe('GET /healthz', () => {
    const url = '/api/v1/healthz';

    it('gives 200 response', async () => {
      const response = await TestUtils.server.get(url).send();
      expect(response.status).toEqual(200);
    });
  });
});
