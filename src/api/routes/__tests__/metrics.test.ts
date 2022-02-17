import request from 'supertest';
import { app } from '../../../app';
import { dataBuilder } from '../../../utils/data-builder';
import { getMetricFormats } from '../metrics';
import { Metric } from '../../../types';

describe('metrics', () => {
  describe('getMetrics', () => {
    it('retrieves metric array', async () => {
      expect.assertions(4);

      const response = await request(app).get('/metrics/');
      const metric = response.body[0];

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.length).toBeGreaterThan(0);
      expect(metric.id).toBeGreaterThan(0);
    });

    it('404 if no metrics found', async () => {
      expect.assertions(4);

      const spy = jest
        .spyOn(dataBuilder, 'buildMetricData')
        .mockImplementationOnce(() => []);

      const response = await request(app).get('/metrics/');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveLength(0);

      spy.mockRestore();
    });

    it('returns 500 if an error occurs', async () => {
      expect.assertions(4);

      const spy = jest
        .spyOn(dataBuilder, 'buildMetricData')
        .mockImplementationOnce(() => undefined as unknown as Metric[]);

      const response = await request(app).get('/metrics/');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(500);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveLength(0);

      spy.mockRestore();
    });
  });

  describe('getMetricFormats', () => {
    it('returns an array of metric formats', async () => {
      expect.assertions(2);

      const actual = await getMetricFormats().then((r) => r);
      const { id } = actual[0];

      expect(actual.length).toBeGreaterThan(0);
      expect(id).toBeGreaterThan(0);
    });

    it('returns an empty array if no metrics found', async () => {
      expect.assertions(2);

      const spy = jest
        .spyOn(dataBuilder, 'buildMetricFormatData')
        .mockImplementationOnce(() => []);

      const actual = await getMetricFormats().then((r) => r);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(actual).toStrictEqual([]);

      spy.mockRestore();
    });

    it('returns an empty array if an error occurs', async () => {
      expect.assertions(2);

      const spy = jest
        .spyOn(dataBuilder, 'buildMetricFormatData')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      const actual = await getMetricFormats().then((r) => r);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(actual).toStrictEqual([]);

      spy.mockRestore();
    });
  });
});
