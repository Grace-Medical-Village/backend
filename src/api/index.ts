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
  deletePatientAllergy,
  deletePatientCondition,
  deletePatientMedication,
  deletePatientMetric,
  deletePatientNote,
  getPatient,
  getPatients,
  postPatient,
  postPatientAllergies,
  postPatientCondition,
  postPatientMedication,
  postPatientMetric,
  postPatientNote,
  putPatient,
  putPatientAllergies,
  putPatientArchive,
  putPatientNote,
} from './routes/patient';
import { getHealthCheck } from './routes/health-check';
import {
  getMapPatientCount,
  getMapPatients,
  getPatientCount,
} from './routes/analytics';

export const buildRouter = (): Router => {
  const router = Router();
  router.use('/analytics', getAnalyticsRouter());
  router.use('/conditions', getConditionRouter());
  router.use('/medications', getMedicationRouter());
  router.use('/metrics', getMetricRouter());
  router.use('/patients', getPatientRouter());
  router.use('/health', getHealthCheckRouter());
  return router;
};

export const getAnalyticsRouter = (): Router => {
  const router = Router();
  router.get('/patients/map', getMapPatients);
  router.get('/patients/count', getPatientCount);
  router.get('/patients/map/count', getMapPatientCount);
  return router;
};

export const getConditionRouter = (): Router => {
  const router = Router();
  router.get('/', getConditions);
  return router;
};

export const getHealthCheckRouter = (): Router => {
  const router = Router();
  router.get('/', getHealthCheck);
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
  router.post('/allergy', postPatientAllergies);
  router.post('/condition', postPatientCondition);
  router.post('/medication', postPatientMedication);
  router.post('/metric', postPatientMetric);
  router.post('/note', postPatientNote);
  router.put('/:id', putPatient);
  router.put('/allergy/:id', putPatientAllergies);
  router.put('/archive/:id', putPatientArchive);
  router.put('/note/:noteId', putPatientNote);
  router.delete('/:patientId', deletePatient);
  router.delete('/allergy/:patientAllergyId', deletePatientAllergy);
  router.delete('/condition/:patientConditionId', deletePatientCondition);
  router.delete('/medication/:patientMedicationId', deletePatientMedication);
  router.delete('/metric/:patientMetricId', deletePatientMetric);
  router.delete('/note/:id', deletePatientNote);
  return router;
};
