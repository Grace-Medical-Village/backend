import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';
// import { isLocal } from './config';

export const main = async (): Promise<void> => {
  serverlessExpress({ app });
};

export const localServer = (): void => {
  const port = process.env.PORT ?? 4000;
  app.listen(port, () => console.log(`Listening on port: ${port}`));
};

// if (isLocal()) localServer();
localServer();
