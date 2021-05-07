const { createTestClient } = require("apollo-server-testing");
const { request } = require('graphql-request');
const { GRAPHQL_ENDPOINT } = require('../../consts');

describe("Graphql queries", () => {
  test("should fetch all transactions by user", async () => {
    const response = await request(GRAPHQL_ENDPOINT, `
      {
        transactions(username: "moshe") {
          amount
          date
          description
        }
      }
    `);
    expect(response.errors).toBeFalsy();
    const allTransactions = response.transactions;
    expect(allTransactions).toHaveLength(101);
  });
  test("should fetch all transactions by username and dates", async () => {
    const response = await request(GRAPHQL_ENDPOINT, `
      {
        transactions(username: "moshe", startDate: "01/10/2017", endDate: "15/08/2018") {
          amount
          date
          description
        }
      }
    `);
    expect(response.errors).toBeFalsy();
    const allTransactions = response.transactions;
    expect(allTransactions).toHaveLength(45);
  });
});
