const promiseRetry = require("promise-retry");

const callWithRetry = function(fn) {
  return promiseRetry(
    async function(retry) {
      try {
        return await fn();
      } catch (err) {
        logger.info("Retrying request after failure", { err });
        return retry(err);
      }
    },
    {
      retries: 5,
      factor: 1,
      minTimeout: 500,
      maxTimeout: 1000,
      randomize: false
    }
  );
};

module.exports = callWithRetry;
