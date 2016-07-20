var requestHelper = require('../utils/request');

module.exports.getMarketers = function getMarketers() {
  return requestHelper({url: '/marketers'});
};

module.exports.getBudgets = function(marketerId) {
  return requestHelper({url: `/marketers/${marketerId}/budgets`});
};

module.exports.getCampaigns = function(marketerId, includeArchived, fetch) {
  includeArchived = includeArchived || false;
  fetch = fetch || 'all';
  return requestHelper({url: `/marketers/${marketerId}/campaigns?includeArchived=${includeArchived}&fetch=`, qs: {includeArchived, fetch}});
};
