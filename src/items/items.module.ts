import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsGateway } from './items.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Items } from './entities/item.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Items]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
      // secret: 'your-secret-key', // Use environment variables for production
      // signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [ItemsGateway, ItemsService],
})
export class ItemsModule {}
