import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    // @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    private readonly appService: AppService,
  ) {}

  // async onModuleInit() {
  //   await this.client.connect();
  // }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('rabbit')
  // async sendMessage() {
  //   return this.client.send({ cmd: 'message' }, { data: 'Hello from NestJS!' });
  // }
}
