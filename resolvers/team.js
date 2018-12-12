import formatError from '../utils/formatErrors';
import { requireAuth } from '../configs/authentication';

export default {
  Query: {
    allTeams: requireAuth.createResolver(async (parent, args, { models, user }) => {
      const allTeams = await models.Team.findAll({ where: { owner: user.id } }, { raw: true });

      return allTeams;
    }),
  },

  Mutation: {
    createTeam: requireAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const team = await models.Team.create({ ...args, owner: user.id });
        await models.Channel.create({ name: 'general', public: true, teamId: team.id });

        return {
          sucess: true,
          team,
        };
      } catch (err) {
        return {
          sucess: false,
          errors: formatError(err, models),
        };
      }
    }),
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
  },
};
