import formatError from '../utils/formatErrors';
import { requireAuth } from '../configs/authentication';

export default {
  Mutation: {
    createChannel: requireAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const team = await models.Team.findOne({ where: { id: args.teamId } }, { raw: true });

        if (team.owner !== user.id) {
          return {
            sucess: false,
            errors: [
              {
                path: 'name',
                message: 'You have to be the owner of the team to create channels',
              }
            ],
          };
        }

        const channel = await models.Channel.create(args);
        return {
          sucess: true,
          channel,
        };
      } catch (err) {
        return {
          sucess: false,
          errors: formatError(err, models),
        };
      }
    }),
  },
};
