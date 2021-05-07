const { gql } = require("apollo-server-express");

module.exports = gql`
  type Transaction {
    amount: Int
    description: String
    date: String
  }

  type Query {
    transactions(username: String!, startDate: String, endDate: String): [Transaction!]!
  }
`;
