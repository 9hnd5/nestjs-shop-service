import { DataSource } from 'typeorm';

const dataSource = new DataSource({
    type: 'mysql',
    host: '172.200.0.200',
    port: 6003,
    username: 'running',
    password: '6eWG&=:G',
    database: 'comatic_icc',
    entities: [__dirname + '/modules/**/**.entity.{ts,js}'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    synchronize: false,
});

export { dataSource };
