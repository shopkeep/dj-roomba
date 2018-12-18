const noLocationFound = require("../no-location-found");

describe("no-location-found", function() {
  let testContext;

  beforeEach(function() {
    testContext = {};
    testContext.messageMock = { user: "test-user" };
    testContext.updateMessage = jest.fn();
    testContext.locationMock = { name: "test-location" };
    testContext.locationNameMock = "test-location";
  });

  describe("when there is a matching location", function() {
    beforeEach(async function() {
      testContext.result = await noLocationFound(
        testContext.messageMock,
        testContext.updateMessage,
        testContext.locationMock,
        testContext.locationNameMock
      );
    });

    it("returns false", function() {
      expect(testContext.result).toBe(false);
    });

    it("does not update the user with a message", function() {
      expect(testContext.updateMessage).not.toHaveBeenCalled();
    });
  });

  describe("when there is no matching location", function() {
    beforeEach(async function() {
      testContext.result = await noLocationFound(
        testContext.messageMock,
        testContext.updateMessage,
        null,
        testContext.locationNameMock
      );
    });

    it("returns true", function() {
      expect(testContext.result).toBe(true);
    });

    it("updates the user with message", function() {
      expect(testContext.updateMessage).toHaveBeenCalled();
      expect(testContext.updateMessage.mock.calls.length).toBe(1);
      expect(testContext.updateMessage).toHaveBeenCalledWith(
        "Sorry <@test-user>, there doesn't seem to be a speaker in `test-location`!"
      );
    });
  });

  describe("when there is location name provided", function() {
    beforeEach(async function() {
      testContext.result = await noLocationFound(
        testContext.messageMock,
        testContext.updateMessage,
        null,
        undefined
      );
    });

    it("returns true", function() {
      expect(testContext.result).toBe(true);
    });

    it("updates the user with message", function() {
      expect(testContext.updateMessage).toHaveBeenCalled();
      expect(testContext.updateMessage.mock.calls.length).toBe(1);
      expect(testContext.updateMessage).toHaveBeenCalledWith(
        "Sorry <@test-user>, there doesn't seem to be a speaker where you are!"
      );
    });
  });

  describe("when called by slackbot", function() {
    beforeEach(function() {
      testContext.slackbotMessageSMock = { user: "test-slackbot" };
    });

    describe("with matching location", function() {
      beforeEach(async function() {
        testContext.result = await noLocationFound(
          testContext.slackbotMessageSMock,
          testContext.updateMessage,
          testContext.locationMock,
          testContext.locationNameMock
        );
      });

      it("returns false", function() {
        expect(testContext.result).toBe(false);
      });

      it("does not update the user with a message", function() {
        expect(testContext.updateMessage).not.toHaveBeenCalled();
      });
    });

    describe("without matching location", function() {
      beforeEach(async function() {
        testContext.result = await noLocationFound(
          testContext.slackbotMessageSMock,
          testContext.updateMessage,
          null,
          undefined
        );
      });

      it("returns true", function() {
        expect(testContext.result).toBe(true);
      });

      it("updates the user with message", function() {
        expect(testContext.updateMessage).toHaveBeenCalled();
        expect(testContext.updateMessage.mock.calls.length).toBe(1);
        expect(testContext.updateMessage).toHaveBeenCalledWith(
          ":x:  No location specified in reminder"
        );
      });
    });
  });
});
