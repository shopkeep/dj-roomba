const axios = require("axios");
const _ = require("lodash");
const getClient = require("./get-client");
const { sanitiseInput, getRandomInt } = require("../utils");
const { convertToSongObject, getTracks } = require("./utils");

const categories = [
  "toplists",
  "pop",
  "hiphop",
  "workout",
  "rock",
  "party",
  "decades"
];

const getVerifiedInputFor = async function(artist, songTitle) {
  if (_.isUndefined(process.env.MUSIXMATCH_TOKEN))
    return { artist, songTitle, isVerified: false };

  const trackSearch = "http://api.musixmatch.com/ws/1.1/track.search";
  const response = await axios.get(trackSearch, {
    params: {
      q_artist: artist,
      q_track: songTitle,
      page_size: 5,
      s_track_rating: "desc",
      s_artist_rating: "desc",
      apikey: process.env.MUSIXMATCH_TOKEN
    }
  });

  const result = _.first(response.data.message.body.track_list);
  if (_.isUndefined(result)) return { artist, songTitle, isVerified: false };

  logger.debug("Verified result", { result });
  const verifiedArtist = result.track.artist_name;
  const verifiedSongTitle = _.first(result.track.track_name.split("(")).trim();

  if (
    (verifiedArtist.includes("feat.") &&
      verifiedArtist.split("feat.")[1].includes(artist)) ||
    (verifiedArtist.includes("ft.") &&
      verifiedArtist.split("ft.")[1].includes(artist)) ||
    _.isEmpty(verifiedSongTitle)
  ) {
    return { artist, songTitle, isVerified: false };
  }

  return {
    artist: verifiedArtist,
    songTitle: verifiedSongTitle,
    isVerified: true
  };
};

const findTrackOn = async function(
  spotify,
  market,
  inputArtist,
  inputSongTitle
) {
  const { artist, songTitle, isVerified } = await getVerifiedInputFor(
    sanitiseInput(inputArtist),
    sanitiseInput(inputSongTitle)
  );
  logger.debug("Verified input for song", { artist, songTitle, isVerified });

  const verifiedSearch = `track:"${sanitiseInput(
    songTitle
  )}" artist:"${sanitiseInput(artist)}"`;
  const unverifiedSearch = `"${sanitiseInput(
    inputSongTitle
  )}" artist:"${sanitiseInput(inputArtist)}"`;

  if (!isVerified) {
    logger.debug("Spotify unverified query", { unverifiedSearch });
    return spotify.searchTracks(unverifiedSearch, { market });
  }

  logger.debug("Spotify verified query", { verifiedSearch });
  const data = await spotify.searchTracks(verifiedSearch, { market });

  if (getTracks(data).length > 0) return data;

  logger.debug("No verified matches - Spotify unverified query", {
    unverifiedSearch
  });
  return spotify.searchTracks(unverifiedSearch, { market });
};

const init = function() {
  logger.debug("Setting up spotify client");
  const spotify = getClient();

  const library = {
    blindSearch({ spotifyMarket: market }, searchTerm) {
      logger.debug("Finding any song", { searchTerm });

      const wildcardQuery = `"${searchTerm}" OR artist:"${searchTerm}"`;

      return spotify
        .searchTracks(wildcardQuery, { market })
        .then(function(data) {
          const tracks = getTracks(data);
          if (tracks.length === 0) return null;

          const track = _.first(tracks);
          logger.debug("Selected song", { track });
          return convertToSongObject(track);
        });
    },

    songSearch: async function({ spotifyMarket }, inputArtist, inputSongTitle) {
      logger.debug("Finding specific song", { inputArtist, inputSongTitle });
      const data = await findTrackOn(
        spotify,
        spotifyMarket,
        inputArtist,
        inputSongTitle
      );
      const tracks = getTracks(data);
      if (tracks.length === 0) return null;

      const track = _.first(tracks);
      logger.debug("Selected song", {
        track: _.omit(track, ["available_markets", "album.available_markets"])
      });

      return convertToSongObject(track);
    },

    getSongs: async function(location, ids) {
      logger.debug("Finding specific songs", { ids });
      if (ids.length === 0) return [];
      const response = await spotify.getTracks(ids);
      return _.map(_.compact(response.body.tracks), convertToSongObject);
    },

    random({ spotifyMarket: country }) {
      logger.debug("Finding random song");

      const category = categories[getRandomInt(categories.length - 1)];
      return spotify
        .getPlaylistsForCategory(category, { country })
        .then(function(data) {
          const playlists = data.body.playlists.items;
          if (playlists.length === 0) return null;

          const { id } = playlists[getRandomInt(playlists.length - 1)];
          return spotify.getPlaylist(id);
        })
        .then(function(data) {
          if (_.isNull(data)) return null;

          const tracks = _.map(data.body.tracks.items, "track");
          if (tracks.length === 0) return null;

          const track = tracks[getRandomInt(tracks.length - 1)];
          logger.debug("Selected song", { track });
          return convertToSongObject(track);
        });
    }
  };

  return library;
};

module.exports = init;
