import request from 'supertest';
import { app } from '../../../app';

describe('buildMedicationData', () => {
  it.todo;
});

describe('getMedications', () => {
  it('returns a status on 200', () => {
    request(app)
      .get('/medication')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
      });
  });
});
