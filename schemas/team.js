import { gql } from 'apollo-server-express';

export default gql`
  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }

  type createTeamResponse {
    sucess: Boolean!
    errors: [Error!]
  }

  type Mutation {
    createTeam(name: String!): createTeamResponse!
  }
`;
