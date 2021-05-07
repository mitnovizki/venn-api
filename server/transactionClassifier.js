const { TRANSACTION_CATEGORIES } = require("../consts");
const {
  EATING_OUT,
  CAR_MAINTENANCE,
  VACATION,
  MEDICAL,
  GROCERIES,
  ENTERTAINMENT,
  BILLS,
  PUBLIC_TRANSPORTATION
} = TRANSACTION_CATEGORIES;

const SUBSTRING_TO_CATEGORY = {
  pizza: EATING_OUT,
  garage: CAR_MAINTENANCE,
  flight: VACATION,
  hotel: VACATION,
  doctor: MEDICAL,
  drugstore: MEDICAL,
  grocery: GROCERIES,
  cinema: ENTERTAINMENT,
  play: ENTERTAINMENT,
  electric: BILLS,
  gas: BILLS,
  bus: PUBLIC_TRANSPORTATION,
  taxi: PUBLIC_TRANSPORTATION
};
const CATEGORIZED_SUBSTRINGS = Object.keys(SUBSTRING_TO_CATEGORY);
const SLEEP_TIME_IN_MILLISECONDS = 300;

async function classifyTransaction(transactionDescription) {
  // Simulate server work
  await sleep(SLEEP_TIME_IN_MILLISECONDS);
  if (!transactionDescription) {
    return null;
  }
  const matchedSubstring = CATEGORIZED_SUBSTRINGS.find(categorizedSubstring => {
    return transactionDescription.toLowerCase().includes(categorizedSubstring);
  });

  return matchedSubstring && SUBSTRING_TO_CATEGORY[matchedSubstring];
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = {
  classifyTransaction
};
