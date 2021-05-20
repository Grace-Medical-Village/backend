import { Router } from 'express';
import { getConditions } from './routes/conditions';
import {
  deleteMedication,
  getMedication,
  getMedicationCategories,
  getMedications,
  postMedication,
  putMedication,
} from './routes/medications';
import { getMetrics } from './routes/metrics';
import {
  deletePatient,
  deletePatientCondition,
  deletePatientMedication,
  deletePatientMetric,
  deletePatientNote,
  getPatient,
  getPatients,
  postPatient,
  postPatientCondition,
  postPatientMedication,
  postPatientMetric,
  postPatientNote,
  putPatientMetric,
  putPatientNote,
} from './routes/patient';

export const buildRouter = (): Router => {
  const router = Router();
  router.use('/conditions', getConditionRouter());
  router.use('/medications', getMedicationRouter());
  router.use('/metrics', getMetricRouter());
  router.use('/patients', getPatientRouter());
  return router;
};

export const getConditionRouter = (): Router => {
  const router = Router();
  router.get('/', getConditions);
  return router;
};

export const getMedicationRouter = (): Router => {
  const router = Router();
  router.get('/', getMedications);
  router.get('/categories', getMedicationCategories);
  router.get('/:id', getMedication);
  router.post('/', postMedication);
  router.put('/', putMedication);
  router.delete('/:id', deleteMedication);
  return router;
};

export const getMetricRouter = (): Router => {
  const router = Router();
  router.get('/', getMetrics);
  return router;
};

export const getPatientRouter = (): Router => {
  const router = Router();
  router.get('/', getPatients);
  router.get('/:id', getPatient);
  router.post('/', postPatient);
  router.post('/condition', postPatientCondition);
  router.post('/medication', postPatientMedication);
  router.post('/metric', postPatientMetric);
  router.post('/note', postPatientNote);
  // router.put('/', putPatient); TODO
  router.put('/metric', putPatientMetric);
  router.put('/note', putPatientNote);
  router.delete('/:id', deletePatient);
  router.delete('/condition/:id', deletePatientCondition);
  router.delete('/medication/:id', deletePatientMedication);
  router.delete('/metric/:id', deletePatientMetric);
  router.delete('/note/:id', deletePatientNote);
  return router;
};
