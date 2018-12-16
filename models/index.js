import Sequelize from 'sequelize';
import keys from '../configs/keys';

const sequelize = new Sequelize('mchat', 'postgres', keys.postgresPass, {
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op,
  logging: false,
  define: {
    underscored: true,
  },
});

const models = {
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
  Member: sequelize.import('./member'),
};

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.op = Sequelize.Op;

export default models;
