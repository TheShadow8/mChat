import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schema';
import resolvers from './resolvers';

const app = express();

// Use body parser
app.use(bodyParser.json());

//  Apollo Server GraphQL
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

// Server listen
const port = process.env.PORT || 8088;

app.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
