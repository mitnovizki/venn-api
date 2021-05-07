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

describe("generateReport tests", () => {
  test('should return a report for a requested user based on start and end dates range ', () => {


    const mosh = await generateReport({
      user: "moshe", start: "01/10/2015", end: "15/08/2017"
    })
    const dave = await generateReport({
      user: "david", start: "01/10/15", end: "15/08/2017"
    })

    expect(mosh).toHaveLength > 0
    expect(mosh[0]).toMatchObject(expect.any(String), expect.any(Number))
    expect(mosh).toEqual(mock)
    expect(dave).toContain("Invalid date format:")

  });
});
