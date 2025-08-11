import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { DatabaseModule } from './database/database.module';
// import {config as dotenvConfig} from 'dotenv';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { getDataSource } from './data-source';
// import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'RABBITMQ_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://guest:guest@localhost:5672'],
    //       queue: 'main_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     },
    //   },
    // ]),
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        ...(await getDataSource()).options,
      }),
      // useFactory: async (configService: ConfigService) => ({
      //   type: 'mysql',
      //   host: configService.get('host'),
      //   port: 3306,
      //   username: 'root',
      //   password: configService.get('password'),
      //   database: configService.get('database'),
      //   autoLoadEntities: true,
      //   synchronize: false,
      //   ssl: {
      //     ca: process.env.DB_CA_CERT,
      //   },
      // }),
      // inject: [ConfigService],
    }),

    ItemsModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
