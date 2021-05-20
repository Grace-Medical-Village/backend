import { buildMedicationData } from '../medications';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
// import { Server } from 'http';
// import { startServer } from '../../../index';

// let server: Server;
// async function buildServer(): Promise<void> {
//   server = await startServer();
// }
// async function closeServer(): Promise<void> {
//   await server.close();
// }

describe('medication', () => {
  describe('buildMedicationData', () => {
    it('returns an empty list if field list is not provided', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      expect(buildMedicationData(emptyArray)).toStrictEqual(emptyArray);
    });
  });

  describe('buildMedicationCategoryData', () => {
    it.todo;
  });

  describe('getMedications', () => {
    it.todo;
  });

  describe('getMedicationCategories', () => {
    it.todo;
  });

  describe('postMedication', () => {
    it.todo;
  });

  describe('putMedication', () => {
    it.todo;
  });
});
