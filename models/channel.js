export default (sequelize, DataTypes) => {
  const Channel = sequelize.define('channel', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: 1,
          msg: 'Channel name needs to be at least 1 character',
        },
      },
    },
    public: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
  });

  Channel.associate = models => {
    // 1:M
    Channel.belongsTo(models.Team, {
      foreignKey: {
        name: 'teamId',
        field: 'team_id',
      },
    });
    // N:M
    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey: {
        name: 'channelId',
        field: 'channel_id',
      },
    });
  };

  return Channel;
};
