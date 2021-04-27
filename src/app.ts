import cors from 'cors';
import express, { json } from 'express';
import morgan from 'morgan';
import { buildRouter } from './api';
import { errorMiddleware } from './utils/error-middleware';

const app = express();
const router = buildRouter();

app.use(cors());
app.use(errorMiddleware);
app.use(json());
app.use(morgan('tiny'));
app.use(router);

export { app };
