import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';
import { isLocal } from './config';

export const main = (): void => {
  console.log('main.6');
  serverlessExpress({ app });
  console.log('main.8');
};

export const localServer = (): void => {
  const port = process.env.PORT ?? 4000;
  app.listen(port, () => console.log(`Listening on port: ${port}`));
};

if (isLocal()) localServer();
