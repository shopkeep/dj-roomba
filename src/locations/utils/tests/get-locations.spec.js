const getLocations = require("../get-locations");

describe("get-locations", function() {
  beforeEach(function() {
    process.env.LOCATION_1_NAME = "New York";
    process.env.LOCATION_1_TIMEZONE = "America/New_York";
    process.env.LOCATION_1_SONOS_ADDRESS = "127.0.0.1";
    process.env.LOCATION_1_SPOTIFY_REGION = "US";
    process.env.LOCATION_1_SPOTIFY_MARKET = "US";
    process.env.LOCATION_1_DEFAULT_VOLUME = "42";

    process.env.LOCATION_2_NAME = "London";
    process.env.LOCATION_2_TIMEZONE = "Europe/London";
    process.env.LOCATION_2_SONOS_ADDRESS = "127.0.0.1";
    process.env.LOCATION_2_SPOTIFY_REGION = "EU";
    process.env.LOCATION_2_SPOTIFY_MARKET = "GB";
    process.env.LOCATION_2_DEFAULT_VOLUME = "50";
  });

  afterEach(function() {
    delete process.env.LOCATION_1_NAME;
    delete process.env.LOCATION_1_TIMEZONE;
    delete process.env.LOCATION_1_SONOS_ADDRESS;
    delete process.env.LOCATION_1_SPOTIFY_REGION;
    delete process.env.LOCATION_1_SPOTIFY_MARKET;
    delete process.env.LOCATION_1_DEFAULT_VOLUME;

    delete process.env.LOCATION_2_NAME;
    delete process.env.LOCATION_2_TIMEZONE;
    delete process.env.LOCATION_2_SONOS_ADDRESS;
    delete process.env.LOCATION_2_SPOTIFY_REGION;
    delete process.env.LOCATION_2_SPOTIFY_MARKET;
    delete process.env.LOCATION_2_DEFAULT_VOLUME;
  });

  it("generates a locations list from the environment variables", function() {
    expect(getLocations()).toMatchSnapshot();
  });
});
