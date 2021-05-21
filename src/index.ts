import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';
import { isLocal } from './config';
import { Server } from 'http';

export const main = (): unknown => serverlessExpress({ app });

export const port: number = Number(process?.env?.PORT) ?? 4000;

export const startServer = (): Promise<Server> => {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
      const close = server.close.bind(server);
      server.close = (): any => {
        return new Promise((resolveClose) => close(resolveClose));
      };
      resolve(server);
    });
  });
};

if (isLocal()) {
  startServer()
    .then((r) => r)
    .catch((e) => console.error(e));
}
