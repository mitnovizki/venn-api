const axios = require('axios');
const { GraphQLClient } = require('graphql-request');
const { GRAPHQL_ENDPOINT, CATEGORIES_ENDPOINT } = require('../consts');

const client = new GraphQLClient(GRAPHQL_ENDPOINT);
const cache = [];
/**
 * Generates a report object containing the total spending of the given user in the given date range.
 * The report object's keys are all the transaction categories, and the values are the total spending
 * in each category.
 *
 * @param username             The username for which to generate the report (the USERNAMES const contains the possible usernames).
 * @param startDate (optional) Limit the transactions the report takes into account to ones that happened on or after the given startDate.
 *                             Date format is `DD/MM/YYYY` (for example `01/10/2017` or `15/08/2018`)
 * @param endDate   (optional) Limit the transactions the report takes into account to ones that happened on or before the given endDate.
 *                             Date format is `DD/MM/YYYY` (for example `01/10/2017` or `15/08/2018`)
 * @returns Promise            Example return value:
 *
 *                                {
 *                                   EATING_OUT: 4325,
 *                                   GROCERIES: 0,
 *                                   VACATION: 228,
 *                                   MEDICAL: 780,
 *                                   PUBLIC_TRANSPORTATION: 0,
 *                                   CAR_MAINTENANCE: 2000,
 *                                   SAVINGS: 350,
 *                                   BILLS: 0,
 *                                   ENTERTAINMENT: 0
 *                                }
 *
 */
async function classifyTransactionAxios(description) {
  return axios.post(CATEGORIES_ENDPOINT, { transactionDescription: description })
    .then((response) => response.data.transactionCategory);
}

function groupCategoriesByTotalAmount(categoryAmountFlatTable, categoryName) {
  return categoryAmountFlatTable.reduce((totalAmountForEachCategory, currentAmountForCategory) => {
    const category = currentAmountForCategory[categoryName];
    if (!totalAmountForEachCategory[category]) {
      totalAmountForEachCategory[category] = 0;
    }
    totalAmountForEachCategory[category] += currentAmountForCategory.amount;
    return totalAmountForEachCategory;
  }, {});
}

async function getCategories(transactions) {
  const categoryAmountFlat = [];
  let promises = [];
  let result;
  let clientCallsLimit = 0;

  try {
    for (let i = 0; i < transactions.length; i += 1) {
      const singleTransaction = transactions[i];
      if (cache[singleTransaction.description]) {
        categoryAmountFlat.push({
          desc: cache[singleTransaction.description] || 'NO_CATEGORY',
          amount: singleTransaction.amount
        });
      } else {
        clientCallsLimit += 1;
        promises.push(new Promise((resolve) => {
          resolve(classifyTransactionAxios(singleTransaction.description)
            .then((categoryName) => {
              categoryAmountFlat.push({
                desc: categoryName || 'NO_CATEGORY',
                amount: singleTransaction.amount
              });
              const { description } = singleTransaction;
              if (!cache[description]) {
                cache[description] = categoryName;
              }
            }));
        }));
      }
      if (clientCallsLimit === 10) {
        clientCallsLimit = 0;
        Promise.all(promises);
        promises = [];
      }
    }
    if (clientCallsLimit < 10) {
      await Promise.all(promises);
    }
    result = await groupCategoriesByTotalAmount(categoryAmountFlat, 'desc');
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

async function generateReport(username, startDate, endDate) {
  if (!username) {
    return ('username can not be empty.');
  }

  const query = `query($user:String!, $startDate:String, $endDate:String){
     transactions(username: $user, startDate: $startDate, endDate: $endDate){
            amount
            description
          }}`;

  const variables = { user: username, startDate, endDate };

  return client.request(query, variables)
    .then((report) => getCategories(report.transactions))
    .catch((err) => { throw new Error(err); });
}
module.exports = {
  generateReport
};
