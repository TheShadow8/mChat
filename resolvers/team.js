export default {
  Mutation: {
    createTeam: async (parent, args, { models }) => {
      try {
        await models.Team.create({ ...args, owner: 1 });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
