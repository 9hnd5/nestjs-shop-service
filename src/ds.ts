import { DataSource } from 'typeorm';

const dataSource = new DataSource({
    type: 'mysql',
    host: '172.16.0.110',
    port: 6003,
    username: 'dev',
    password: 'comatic_dev@2022',
    database: 'comatic_icc',
    entities: [__dirname + '/modules/**/**.config.{ts,js}'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    synchronize: false,
});

export { dataSource };
