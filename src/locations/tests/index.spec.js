const locations = require("../");
const mockLocations = require("./test-data/locations");
let mockTimezone;

jest.mock("@shopkeep/bot-scripts/utils", () => {
  return {
    getUser: jest.fn(() => ({ id: "test-user", tz: mockTimezone }))
  };
});

jest.mock("../utils", () => {
  return {
    getLocations: jest.fn(() => mockLocations),
    createPlayer: jest.fn(() => "mock-player")
  };
});

describe("locations", function() {
  let testContext;

  beforeEach(function() {
    mockTimezone = undefined;
    testContext = {};
    testContext.locations = locations();
    testContext.botMock = { botMock: true };
    testContext.messageMock = { user: "test-user" };
  });

  describe("getLocations", function() {
    it("returns a list of locations", function() {
      expect(testContext.locations.getLocations()).toMatchSnapshot();
    });
  });

  describe("getLocation", function() {
    describe("when matching on location name", function() {
      beforeEach(function() {
        mockTimezone = undefined;
        testContext.locationName = "New York";
      });

      it("returns a matching location", async function() {
        expect(
          await testContext.locations.getLocation(
            testContext.botMock,
            testContext.messageMock,
            testContext.locationName
          )
        ).toMatchSnapshot();
      });
    });

    describe("when matching on users timezone", function() {
      beforeEach(function() {
        mockTimezone = "Europe/London";
        testContext.locationName = undefined;
      });

      it("returns a matching location", async function() {
        expect(
          await testContext.locations.getLocation(
            testContext.botMock,
            testContext.messageMock,
            testContext.locationName
          )
        ).toMatchSnapshot();
      });
    });

    describe("when no location match", function() {
      beforeEach(function() {
        mockTimezone = "Asia/Shanghai";
        testContext.locationName = "Shanghai";
      });

      it("returns a matching location", async function() {
        expect(
          await testContext.locations.getLocation(
            testContext.botMock,
            testContext.messageMock,
            testContext.locationName
          )
        ).toEqual(null);
      });
    });
  });
});
