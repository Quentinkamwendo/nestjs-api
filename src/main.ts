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
  // 🔹 Handle CORS preflight for ALL requests before Nest starts
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://angular-ui-iota.vercel.app',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
      origin: ['https://angular-ui-iota.vercel.app', 'http://localhost:4200'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = createServer(expressApp);
  }
  return cachedServer.emit('request', req, res);
}
