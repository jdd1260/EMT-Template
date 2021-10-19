import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';

const router = Router();

router.get('/healthz', async (req: Request, res: Response) => {
  return res.status(OK).send('ok');
});

router.get('/versionz', async (req: Request, res: Response) => {
  return res.status(OK).send(`v${process.env.npm_package_version}`);
});

export default router;
