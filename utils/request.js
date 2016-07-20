var constants = require('../constants');
var request = require('request-promise');

module.exports = function(options) {
  options = Object.assign({}, options, {json: true, headers: {'OB-TOKEN-V1': process.env.OB_USER_TOKEN}});
  options.url = constants.AMPLIFY_API_URL + options.url;
  return request(options);
};
