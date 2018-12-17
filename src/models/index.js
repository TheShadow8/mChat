import Sequelize from 'sequelize';
import keys from '../configs/keys';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default async () => {
  let maxReconnects = 20;
  let connected = false;

  const sequelize = new Sequelize('mchat', 'postgres', keys.postgresPass, {
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
    logging: false,
    define: {
      underscored: true,
    },
  });

  // Try to reconnect to database
  while (!connected && maxReconnects) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await sequelize.authenticate();
      connected = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('reconnecting in 5 seconds');
      // eslint-disable-next-line no-await-in-loop
      await sleep(5000);
      maxReconnects -= 1;
    }
  }

  if (!connected) {
    return null;
  }

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

  return models;
};
