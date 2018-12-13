import { gql } from 'apollo-server-express';

export default gql`
  type Team {
    id: Int!
    name: String!
    owner: User!
    members: [User!]
    channels: [Channel!]!
  }

  type createTeamResponse {
    sucess: Boolean!
    team: Team
    errors: [Error!]
  }

  type addTeamMemberResponse {
    sucess: Boolean!
    errors: [Error!]
  }

  type Query {
    allTeams: [Team!]!
    inviteTeams: [Team!]!
  }

  type Mutation {
    createTeam(name: String!): createTeamResponse!
    addTeamMember(email: String!, teamId: Int!): addTeamMemberResponse!
  }
`;
