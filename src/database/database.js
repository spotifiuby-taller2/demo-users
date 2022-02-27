import Sequelize from 'sequelize';

const DATABASE_URL = `${process.env.DB}://${process.env.POSTGRES_USER}` +
                     `:${process.env.POSTGRES_PASSWORD}@${process.env.DB_CONTAINER_NAME}`
                     `:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`;

const database = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  operatorsAliases: Sequelize.Op,
  define: { timestamp: false },
  ssl: true,
  pool: {
    max: 100,
    min: 0,
    idle: 200000,
    acquire: 1000000
  },
  dialectOptions: {},
} );

export {
  database
};
