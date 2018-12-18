const _ = require("lodash");

const getSpotifyId = function(url) {
  const matches = /x-sonos-spotify:spotify%3atrack%3a([^?]+)\?/.exec(url);
  if (_.isNull(matches)) return `unknown-${url}`;
  return matches[1];
};

module.exports = function(track) {
  const id = getSpotifyId(track.uri);
  const url = id.startsWith("unknown-")
    ? ""
    : `https://open.spotify.com/track/${id}`;

  return {
    id,
    name: track.title,
    artist: track.artist,
    url,
    position: track.position,
    duration: track.duration,
    album: {
      id: track.albumArtURI,
      name: track.album,
      image: track.albumArtURL
    }
  };
};
