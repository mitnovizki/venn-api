const { classifyTransaction } = require("./transactionClassifier");
const { TRANSACTION_CATEGORIES } = require("../consts");
const { EATING_OUT, MEDICAL, ENTERTAINMENT, PUBLIC_TRANSPORTATION } = TRANSACTION_CATEGORIES;

describe("Transaction classifier", () => {
  describe("classifyTransaction", () => {
    test("should return null if could not find category for transaction", async () => {
      expect(await classifyTransaction("Some unidentified transaction description")).toBeFalsy();
    });

    test("should return the correct category for known transaction descriptions", async () => {
      expect(await classifyTransaction("Pizza moshe")).toEqual(EATING_OUT);
      expect(await classifyTransaction("Best pizza in the world")).toEqual(EATING_OUT);
      expect(await classifyTransaction("Start cinema")).toEqual(ENTERTAINMENT);
      expect(await classifyTransaction("Doctor spock")).toEqual(MEDICAL);
      expect(await classifyTransaction("Bus")).toEqual(PUBLIC_TRANSPORTATION);
      expect(await classifyTransaction("Central taxis")).toEqual(PUBLIC_TRANSPORTATION);
    });
  });
});
