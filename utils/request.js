var constants = require('../constants');
var request = require('request-promise');
var merge = require('lodash.merge');

module.exports = function(options) {
  options = merge({}, {json: true, headers: {'OB-TOKEN-V1': process.env.OB_USER_TOKEN}}, options);
  options.url = constants.AMPLIFY_API_URL + options.url;
  return request(options);
};
