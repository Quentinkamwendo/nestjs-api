import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Items } from './items/entities/item.entity';

let dataSource: DataSource;

export const getDataSource = async () => {
  if (!dataSource) {
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Items],
      synchronize: false,
      ssl: {
        ca: Buffer.from(
          process.env.DB_CA_CERT.replace(/\\n/g, '\n'),
          'base64',
        ).toString(),
        rejectUnauthorized: false,
      },
      extra: { connectionLimit: 1 },
    });
    await dataSource.initialize();
  }
  return dataSource;
};
