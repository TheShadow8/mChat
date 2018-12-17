import formatError from '../utils/formatErrors';
import { requireAuth } from '../configs/authentication';

export default {
  Query: {
    allTeams: requireAuth.createResolver(async (parent, args, { models, user }) => {
      const allTeams = await models.Team.findAll({ where: { owner: user.id } }, { raw: true });

      return allTeams;
    }),

    inviteTeams: requireAuth.createResolver(async (parent, args, { models, user }) =>
      models.sequelize.query('select * from teams join members on id = team_id where user_id = ?', {
        replacements: [user.id],
        model: models.Team,
      })
    ),
  },

  Mutation: {
    createTeam: requireAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const res = await models.sequelize.transaction(async () => {
          const team = await models.Team.create({ ...args, owner: user.id });
          await models.Channel.create({ name: 'general', public: true, teamId: team.id });
          return team;
        });

        return {
          sucess: true,
          team: res,
        };
      } catch (err) {
        return {
          sucess: false,
          errors: formatError(err, models),
        };
      }
    }),

    addTeamMember: requireAuth.createResolver(
      async (parent, { email, teamId }, { models, user }) => {
        try {
          const teamPromise = models.Team.findOne({ where: { id: teamId } }, { raw: true });
          const userToAddPromise = models.User.findOne({ where: { email } }, { raw: true });
          const [team, userToAdd] = await Promise.all([teamPromise, userToAddPromise]);

          if (team.owner !== user.id) {
            return {
              sucess: false,
              errors: [
                { path: 'email', message: 'You have to be the owner of the team to invite members' }
              ],
            };
          }

          if (!userToAdd) {
            return {
              sucess: false,
              errors: [{ path: 'email', message: 'Could not find user with this email' }],
            };
          }

          await models.Member.create({ userId: userToAdd.id, teamId });
          return {
            sucess: true,
          };
        } catch (err) {
          return {
            sucess: false,
            errors: formatError(err, models),
          };
        }
      }
    ),
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
  },
};
