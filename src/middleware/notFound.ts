import { Request, Response } from 'express';

export default function notFound(req: Request, res: Response): void {
  res.status(404).send({
    message: `no api at '${req.method} ${req.url}'`,
    name: 'NotFound',
    status: 404,
  });
}
