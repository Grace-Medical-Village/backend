import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';
import { Server } from 'http';
import { isLocal } from './utils';

export const main = serverlessExpress({ app });

export const port: number = Number(process?.env?.PORT) ?? 4000;

export const startServer = (): Promise<Server> => {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Listening on port: ${port}`);

      // const close = server.close.bind(server);
      // server.close = (_): unknown => {
      //   return new Promise((resolveClose) => close(resolveClose));
      // };
      resolve(server);
    });
  });
};

if (isLocal()) {
  startServer()
    .then((r) => r)
    .catch((e) => console.error(e));
}
