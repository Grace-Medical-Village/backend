import cors from 'cors';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import { buildRouter } from './api';
import { errorMiddleware } from './utils/error-middleware';

const app = express();
const router = buildRouter();

app.use(cors());
app.use(morgan('tiny'));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(errorMiddleware);
app.use(router);

export { app };
