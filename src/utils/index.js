const _ = require("lodash");

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

const sanitiseInput = function(input) {
  if (!_.isString(input)) return input;

  return input
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/^'/g, "")
    .replace(/'$/g, "")
    .replace(/[\u201C\u201D"`]/g, "")
    .replace(/^(?:a|the) /i, "")
    .replace(/\.$/, "")
    .trim();
};

module.exports = {
  sanitiseInput,
  getRandomInt
};
