var useragent = require("useragent");
// useragent(true);
const parse = (str) => {
  return useragent.parse(str).toJSON();
};
module.exports = {
  parse,
};
