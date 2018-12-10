import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';

import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models';

const app = express();

// User CORS
app.use(cors());

// Use body parser
app.use(bodyParser.json());

//  Apollo Server GraphQL
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models },
});

server.applyMiddleware({ app });

// Server listen
const port = process.env.PORT || 8088;

models.sequelize.sync({}).then(() => {
  app.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
});
