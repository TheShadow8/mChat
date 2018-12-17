import { withFilter } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { requireAuth } from '../configs/authentication';

const pubsub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: 6379,
    retry_strategy: options => Math.max(options.attempt * 100, 3000),
  },
});

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId
      ),
    },
  },

  Message: {
    user: ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }

      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },

  Query: {
    messages: requireAuth.createResolver(
      async (parent, { cursor, channelId }, { models, user }) => {
        const options = {
          order: [['created_at', 'DESC']],
          where: { channelId },
          limit: 15,
        };

        const convertCursor = new Date(parseInt(cursor, 10));
        if (cursor) {
          options.where.created_at = {
            [models.op.lt]: convertCursor,
          };
        }

        return models.Message.findAll(options, { raw: true });
      }
    ),
  },

  Mutation: {
    createMessage: requireAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const message = await models.Message.create({ ...args, userId: user.id });

        const asyncFunc = async () => {
          const currentUser = await models.User.findOne({
            where: {
              id: user.id,
            },
          });

          pubsub.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: {
              ...message.dataValues,
              user: currentUser.dataValues,
            },
          });
        };

        asyncFunc();

        return true;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return false;
      }
    }),
  },
};
