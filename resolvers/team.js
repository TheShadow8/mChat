import formatError from '../utils/formatErrors';
import { requireAuth } from '../configs/authentication';

export default {
  Mutation: {
    createTeam: requireAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        await models.Team.create({ ...args, owner: user.id });

        return {
          sucess: true,
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
