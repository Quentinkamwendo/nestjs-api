import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Items } from './items/entities/item.entity';

let dataSource: DataSource;

export const getDataSource = async () => {
  if (!dataSource) {
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.HOST || 'localhost',
      port: +process.env.PORT || 3306,
      username: process.env.USERNAME || 'root',
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [User, Items],
      ssl: {
        ca: Buffer.from(
          process.env.DB_CA_CERT.replace(/\\n/g, '\n'),
          'base64',
        ).toString(),
      },
      extra: { connectionLimit: 1 },
    });
    await dataSource.initialize();
  }
  return dataSource;
};
