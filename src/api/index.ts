import { Router } from 'express';
import { getMedications } from './routes/medication';

export const buildRouter = (): Router => {
  const router = Router();
  console.log('api.6');
  router.use('/medication', getMedicationRouter());
  // router.use('/patient', getMedicationRouter());
  return router;
};

export const getMedicationRouter = (): Router => {
  const router = Router();
  console.log('api.14');
  router.get('/', getMedications);
  return router;
};
