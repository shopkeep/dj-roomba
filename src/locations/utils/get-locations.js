const _ = require("lodash");
const { Sonos, SpotifyRegion } = require("sonos");

const getLocations = function() {
  const groupedLocationKeys = _(process.env)
    .keys()
    .filter(key => key.startsWith("LOCATION_"))
    .groupBy(key => key.match(/LOCATION_(\d+)_/i)[1])
    .value();

  return _(groupedLocationKeys)
    .values()
    .map(locationKeys => {
      const setupData = _.reduce(
        locationKeys,
        function(location, key) {
          const internalKey = _.camelCase(key.replace(/LOCATION_(\d+)_/i, ""));
          return _.extend(location, { [internalKey]: process.env[key] });
        },
        {}
      );

      const device = new Sonos(setupData.sonosAddress);
      device.setSpotifyRegion(SpotifyRegion[setupData.spotifyRegion || "US"]);

      return _.extend(
        {
          device,
          defaultVolume: 60
        },
        setupData
      );
    })
    .value();
};

module.exports = getLocations;
