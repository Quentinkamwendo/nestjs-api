import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server, createServer, IncomingMessage, ServerResponse } from 'http';

let cachedServer: Server;
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.setGlobalPrefix('api');

//   // await app.startAllMicroservices();
//   await app.listen(3000);
// }
// bootstrap();
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = createServer(expressApp);
  }
  return cachedServer.emit('request', req, res);
}
