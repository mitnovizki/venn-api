const { generateReport } = require('./expenseReportGenerator');

const mock = {
  "PUBLIC_TRANSPORTATION": 2946,
  "EATING_OUT": 1468,
  "CAR_MAINTENANCE": 662,
  "BILLS": 716,
  "VACATION": 1523,
  "MEDICAL": 212,
  "DOES NOT EXIST": 275
}
const mockDavid = {

  "EATING_OUT": 4367,
  "PUBLIC_TRANSPORTATION": 5779,
  "MEDICAL": 1994,
  "VACATION": 4108,
  "BILLS": 1809,
  "DOES NOT EXIST": 966,
  "CAR_MAINTENANCE": 2273

}
const user = "moshe", startDate = "01/10/2015", endDate = "15/08/2017"

describe("generateReport tests", () => {
  test('should return a report for a requested user based on start and end dates range or full range if dates are not specified', async () => {

    const mosh = await generateReport(
      user, startDate, endDate
    );

    const dave = await generateReport(
      "david"
    )
    expect(mosh).toEqual(mock)
    expect(dave).toEqual(mockDavid)
  });
  test('should return error message if username is empty', async () => { expect(await generateReport()).toEqual("username can not be empty.") })
});
