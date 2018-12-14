import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import models from './models';
import keys from './configs/keys';
import { refreshTokens } from './configs/authentication';

const app = express();

// User CORS
app.use(cors());

// Use body parser
app.use(bodyParser.json());

// Validate user via token
const validateUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, keys.secret);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        keys.secret,
        keys.refreshSecret
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(validateUser);

//  Apollo Server GraphQL
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({
    models,
    user: req.user,
    SECRET: keys.secret,
    SECRET2: keys.refreshSecret,
  }),
});

server.applyMiddleware({ app });

// Server listen
const port = process.env.PORT || 8088;

models.sequelize.sync({}).then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    // eslint-disable-next-line no-new
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server: app,
        path: '/subscriptions',
      }
    );
  });
});
