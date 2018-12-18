const _ = require("lodash");
const SpotifyWebApi = require("spotify-web-api-node");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const getRefreshTime = function(expiresIn) {
  const oneMinute = 60000;
  const refreshTime = parseInt(expiresIn, 10) * 1000;

  if (_.isFinite(refreshTime) && refreshTime > oneMinute) {
    return Math.floor(refreshTime * 0.9);
  }

  return Math.floor(oneMinute * 30 * 0.9);
};

const updateToken = function(spotify) {
  logger.debug("Updating Spotify token");
  spotify.clientCredentialsGrant().then(
    function(data) {
      spotify.setAccessToken(data.body.access_token);

      const refreshTime = getRefreshTime(data.body.expires_in);
      logger.debug(
        `Spotify token refresh in ${refreshTime / 1000 / 60} minutes`,
        { refreshTime }
      );
      setTimeout(() => updateToken(spotify), refreshTime);
    },
    function(err) {
      logger.error(
        "Something went wrong when retrieving your Spotify access token",
        err
      );
    }
  );
};

const getClient = function() {
  const spotify = new SpotifyWebApi({ clientId, clientSecret });
  updateToken(spotify);
  return spotify;
};

module.exports = getClient;
