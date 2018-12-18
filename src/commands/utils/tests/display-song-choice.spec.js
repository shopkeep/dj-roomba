const displaySongChoice = require("../display-song-choice");

describe("display-song-choice", function() {
  let testContext;

  beforeEach(function() {
    testContext = {};
    testContext.botMock = { reply: jest.fn() };
    testContext.updateMessage = jest.fn();
    testContext.messageMock = { user: "test-user" };
    testContext.songMock = {
      artist: "test-song-artist",
      name: "test-song-name",
      url: "http://example.com/test-song-url"
    };
    testContext.locationNameMock = "test-location";
  });

  describe("when dry running", function() {
    beforeEach(async function() {
      testContext.dryRunMock = true;

      await displaySongChoice(
        testContext.botMock,
        testContext.updateMessage,
        testContext.messageMock,
        testContext.songMock,
        testContext.dryRunMock,
        testContext.locationNameMock
      );
    });

    it("updates the previous message", function() {
      expect(testContext.updateMessage).toHaveBeenCalled();
      expect(testContext.updateMessage.mock.calls.length).toBe(1);
      expect(testContext.updateMessage).toHaveBeenCalledWith(
        "Thanks <@test-user>, if this hadn't been a dry run :beach_with_umbrella: I'd be playing \"test-song-name\" by test-song-artist :notes:, in test-location:round_pushpin:"
      );
    });

    it("replies with URL to track", function() {
      expect(testContext.botMock.reply).toHaveBeenCalled();
      expect(testContext.botMock.reply.mock.calls.length).toBe(1);
      expect(testContext.botMock.reply).toHaveBeenCalledWith(
        testContext.messageMock,
        "http://example.com/test-song-url"
      );
    });
  });

  describe("when running", function() {
    beforeEach(async function() {
      testContext.dryRunMock = false;

      await displaySongChoice(
        testContext.botMock,
        testContext.updateMessage,
        testContext.messageMock,
        testContext.songMock,
        testContext.dryRunMock,
        testContext.locationNameMock
      );
    });

    it("updates the previous message", function() {
      expect(testContext.updateMessage).toHaveBeenCalled();
      expect(testContext.updateMessage.mock.calls.length).toBe(1);
      expect(testContext.updateMessage).toHaveBeenCalledWith(
        'Thanks <@test-user>, playing "test-song-name" by test-song-artist :notes:, in test-location:round_pushpin:'
      );
    });

    it("replies with URL to track", function() {
      expect(testContext.botMock.reply).toHaveBeenCalled();
      expect(testContext.botMock.reply.mock.calls.length).toBe(1);
      expect(testContext.botMock.reply).toHaveBeenCalledWith(
        testContext.messageMock,
        "http://example.com/test-song-url"
      );
    });
  });
});
