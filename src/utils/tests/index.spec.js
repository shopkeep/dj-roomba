const { sanitiseInput, getRandomInt } = require("../");

describe("utils", function() {
  describe("getRandomInt", function() {
    it("generates a random integer up to the max", function() {
      expect(getRandomInt(1)).toEqual(0);
      expect(Number.isInteger(getRandomInt(100))).toBe(true);
      expect(getRandomInt(100)).toBeLessThan(100);
    });
  });

  describe("sanitiseInput", function() {
    it("ignores non-string input", function() {
      expect(sanitiseInput([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("sanitises string input", function() {
      expect(
        sanitiseInput(
          "'The “Grim” Adventures' of `Billy` &amp; \"Mandy\" &lt;3.'"
        )
      ).toEqual("grim adventures' of billy & mandy <3");
    });
  });
});
