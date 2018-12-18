const { convertToSongObject, getTracks } = require("../");
const songMock = require("./test-data/song");
const tracksMock = require("./test-data/tracks");

describe("spotify utils", function() {
  describe("convertToSongObject", function() {
    it("converts repsonse to song object", function() {
      expect(convertToSongObject(songMock)).toMatchSnapshot();
    });
  });

  describe("getTracks", function() {
    it("extracts playable tracks", function() {
      expect(getTracks(tracksMock)).toMatchSnapshot();
    });
  });
});
