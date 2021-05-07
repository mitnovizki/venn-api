const moment = require('moment');
const mockTransactionData = require('./mockTransactionData');

const DATE_FORMAT = 'DD/MM/YYYY';

function getTransactions({ username, startDate, endDate }) {
  let userTransactions = mockTransactionData[username];
  if (!userTransactions) {
    return null;
  }
  if (startDate) {
    verifyDateFormattedCorrectly(startDate);
    userTransactions = userTransactions.filter(transaction => {
      return moment(transaction.date, DATE_FORMAT).isSameOrAfter(moment(startDate, DATE_FORMAT));
    });
  }
  if (endDate) {
    verifyDateFormattedCorrectly(endDate);
    userTransactions = userTransactions.filter(transaction => {
      return moment(transaction.date, DATE_FORMAT).isSameOrBefore(moment(endDate, DATE_FORMAT));
    });
  }
  sortByDate(userTransactions);
  return userTransactions;
}

function verifyDateFormattedCorrectly(date) {
  if (moment(date, DATE_FORMAT).format(DATE_FORMAT) !== date) {
    throw new Error(`Invalid date format: ${date}. Format should be ${DATE_FORMAT}`);
  }
}

function sortByDate(userTransactions) {
  userTransactions.sort((transaction1, transaction2) => {
    const date1 = moment(transaction1.date, DATE_FORMAT);
    const date2 = moment(transaction2.date, DATE_FORMAT);
    return date1 - date2;
  });
}

module.exports = {
  getTransactions
};
