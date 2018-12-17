export default (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          args: 1,
          msg: 'Team name needs to be at least 1 character',
        },
      },
    },
  });

  Team.associate = models => {
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: {
        name: 'teamId',
        field: 'team_id',
      },
    });
    Team.belongsTo(models.User, {
      foreignKey: 'owner',
    });
  };

  return Team;
};
