import formatError from '../utils/formatErrors';

export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
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
    },
  },
};
