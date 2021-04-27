import { Router } from 'express';
import { getMedications } from './routes/medication';

export const buildRouter = (): Router => {
  const router = Router();
  router.use('/medication', getMedicationRouter());
  // router.use('/patient', getMedicationRouter());
  return router;
};

export const getMedicationRouter = (): Router => {
  const router = Router();
  router.get('/', getMedications);
  return router;
};
