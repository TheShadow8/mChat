import { gql } from 'apollo-server-express';

export default gql`
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }

  type createChannelResponse {
    sucess: Boolean!
    channel: Channel
    errors: [Error!]
  }

  type Mutation {
    createChannel(teamId: Int!, name: String!, public: Boolean = flase): createChannelResponse
  }
`;
