const axios = require('axios');
const { GraphQLClient } = require('graphql-request');
const { GRAPHQL_ENDPOINT, CATEGORIES_ENDPOINT } = require('../consts');
const client = new GraphQLClient(GRAPHQL_ENDPOINT);


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
 */
async function generateReport(username, startDate, endDate) {

  if (!username) {
    return ("username can not be empty.")
  }
  let query =
    `query($user:String!, $startDate:String, $endDate:String){
     transactions(username: $user, startDate: $startDate, endDate: $endDate){
            amount
            description
          }}`

  let variables = { user: username, startDate: startDate, endDate: endDate }

  return await client.request(query, variables)
    .then(report => { return getCategories(report.transactions) })
    .catch((err) => { throw new Error(err) })
}

async function getCategories(transactions) {
  let promises = []
  let categoryAmountFlat = []
  let promisesQueue = []
  let result

  try {
    transactions.forEach(transactionRecord => {
      promises.push(new Promise((resolve) => {
        resolve(classifyTransactionAxios(transactionRecord.description)
          .then(categoryName => {
            categoryAmountFlat.push({ 'category': categoryName || 'NO_CATEGORY', 'amount': transactionRecord.amount });
          })
        )
      }))
    });

    let i, j, chunk = 10;
    for (i = 0, j = promises.length; i < j; i += chunk) {
      promisesQueue.push(promises.slice(i, i + chunk));
    }

    for (let i = 0; i < promisesQueue.length; i++) {
      await Promise.all(promisesQueue[i])
    }


    result = await groupCategoriesByTotalAmount(categoryAmountFlat, 'category')
    return result

  } catch (error) {
    throw new Error(error)
  }

}

async function classifyTransactionAxios(description) {

  return axios.post(CATEGORIES_ENDPOINT, { "transactionDescription": description })
    .then((response) => { return response.data.transactionCategory })
}

const groupCategoriesByTotalAmount = async (categoryAmountFlatTable, key) => {
  return categoryAmountFlatTable.reduce((total, currentAmount) => {

    let category = currentAmount[key];
    if (!total[category]) {
      total[category] = 0;
    }
    total[category] += currentAmount.amount;
    return total;

  }, {});
};

module.exports = {
  generateReport
};
