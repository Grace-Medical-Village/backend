import { Client } from 'pg';
import { BuildValues } from './types';

const { PG_USER, PG_HOST, PG_DATABASE, PG_PASSWORD } = process.env;

export const clientBuilder = (): Client =>
  new Client({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: 5432,
  });

export const buildValues: BuildValues = (values) => values.map((_, i) => `$${i + 1}`).join();
