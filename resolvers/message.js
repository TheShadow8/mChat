export default {
  Mutation: {
    createMessage: async (parent, args, { models }) => {
      try {
        await models.Message.create({ ...args, userId: 1 });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
