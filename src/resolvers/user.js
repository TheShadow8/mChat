import bcrypt from 'bcryptjs';

import formatError from '../utils/formatErrors';
import { validateLogin } from '../configs/authentication';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },

  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      validateLogin(email, password, models, SECRET, SECRET2),
    register: async (parent, { password, password2, ...otherArgs }, { models }) => {
      // Check passwordslength
      if (password.length <= 5) {
        return {
          sucess: false,
          errors: [{ path: 'password', message: 'Password needs to be at least 6 characters' }],
        };
      }
      // Check password confirmation
      if (password !== password2) {
        return {
          sucess: false,
          errors: [{ path: 'password2', message: 'Passwords do not match' }],
        };
      }

      try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await models.User.create({ ...otherArgs, password: hashPassword });

        return {
          sucess: true,
          user: newUser,
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
