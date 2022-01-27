import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';
import { Server } from 'http';
import { isLocal, isTest } from './utils';

export const main = serverlessExpress({ app });

export const port = Number(process?.env?.PORT ?? 4000);

export const startServer = (): Promise<Server> => {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      if (isLocal()) console.log(`Listening on port: ${port}`);
      resolve(server);
    });
  });
};

if (isLocal() || isTest()) {
  startServer()
    .then((r) => r)
    .catch((e) => console.error(e));
}
