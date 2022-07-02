import { Request, Response } from 'express';

async function getHealthCheck(req: Request, res: Response): Promise<void> {
  res.status(200);
  res.json({
    healthy: true,
  });
}

export { getHealthCheck };
