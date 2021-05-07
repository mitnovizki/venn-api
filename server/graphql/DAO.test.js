const DAO = require("./DAO");

describe("DAO", () => {
  test("should return falsy for non existing username", async () => {
    expect(DAO.getTransactions({ username: "asdcasdcsdc" })).toBeFalsy();
  });
  test("should get all transactions by username", async () => {
    const moshesTransaction = DAO.getTransactions({ username: "moshe" });
    expect(moshesTransaction.length).toBeGreaterThan(10);
    expect(moshesTransaction[0]).toMatchObject({
      amount: expect.any(Number),
      description: expect.any(String),
      date: expect.any(String)
    });
  });
  test("Should get transactions by username and dates", async () => {
    const moshesTransactionsByDate = DAO.getTransactions({
      username: "moshe",
      startDate: "01/10/2017",
      endDate: "15/08/2018"
    });
    expect(moshesTransactionsByDate).toHaveLength(45);
  });
  test("Should get transactions by username and dates - inclusive", async () => {
    const moshesTransactionsByDate = DAO.getTransactions({
      username: "moshe",
      startDate: "14/03/2017",
      endDate: "30/03/2017"
    });
    expect(moshesTransactionsByDate).toHaveLength(4);
  });
  test('Should fail in case of invalid date format', () => {
    try {
      DAO.getTransactions({
        username: 'moshe',
        startDate: '1/1/18'
      });
    } catch (e) {
      // This is the expected behaviour
      expect(e.message).toContain('Invalid date format');
      return;
    }
    throw new Error('Should not get here, an exception should have been thrown');
  });
});
