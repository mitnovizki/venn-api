const { getTransactions } = require("./DAO");

module.exports = {
  Query: {
    transactions: (parent, args) => {
      return getTransactions(args);
    }
  }
};
