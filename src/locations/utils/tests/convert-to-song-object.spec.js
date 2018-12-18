const convertToSongObject = require("../convert-to-song-object");

const spotifySong = {
  title: "Road to Nowhere",
  artist: "Greensky Bluegrass",
  album: "Live At Bells",
  albumArtURI:
    "/getaa?s=1&u=x-sonos-spotify%3aspotify%253atrack%253a45RLvNvLYoSPTuTebvEPLK%3fsid%3d12%26flags%3d8224%26sn%3d2",
  position: 240,
  duration: 282,
  albumArtURL:
    "http://10.42.8.69:1400/getaa?s=1&u=x-sonos-spotify%3aspotify%253atrack%253a45RLvNvLYoSPTuTebvEPLK%3fsid%3d12%26flags%3d8224%26sn%3d2",
  uri:
    "x-sonos-spotify:spotify%3atrack%3a45RLvNvLYoSPTuTebvEPLK?sid=12&flags=8224&sn=2",
  queuePosition: 76
};

const otherSong = {
  title: "The Less I Know The Better",
  artist: "Tame Impala",
  album: "Currents",
  albumArtURI: "album-art?for=currents",
  position: 189,
  duration: 216,
  albumArtURL: "https://example.com/album-art?for=currents",
  uri: "my-service:currents:tame-impala:the-less-i-know-the-better",
  queuePosition: 77
};

describe("convert-to-song-object", function() {
  it("converts a spotify song from sonos to general song object", function() {
    expect(convertToSongObject(spotifySong)).toMatchSnapshot();
  });

  it("converts a other song from sonos to general song object", function() {
    expect(convertToSongObject(otherSong)).toMatchSnapshot();
  });
});
