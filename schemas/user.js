import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type Query {
    getUser(id: Int!): User!
    allUsers: [User!]!
  }

  type RegisterResponse {
    sucess: Boolean!
    user: User
    errors: [Error!]
  }

  type LoginResponse {
    sucess: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!, password2: String!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse
  }
`;
