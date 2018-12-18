const _ = require("lodash");

const karaokeDifferential = 5;

const convertToSongObject = function({
  id,
  name,
  artists,
  popularity,
  explicit,
  duration_ms: duration,
  external_urls: { spotify: url },
  album
}) {
  return {
    id,
    name,
    artist: artists[0].name,
    url,
    popularity,
    explicit,
    duration,
    album: {
      id: album.id,
      name: album.name,
      image: album.images[0]
    }
  };
};

const getTracks = function(data) {
  const tracks = data.body.tracks.items;
  return _.filter(
    tracks,
    ({ name, popularity }) =>
      popularity >= karaokeDifferential &&
      !name.toLowerCase().includes("karaoke")
  );
};

module.exports = {
  convertToSongObject,
  getTracks
};
