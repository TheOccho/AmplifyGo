var api = require('../api');

function _stepOne() {

	// Fetch marketers
	return api.getMarketers().then(function(body) {
		const _marketerId = body.marketers[0].id;
		api.getCampaigns(_marketerId).then(function(body) {
			console.dir(body);
			return  ['a', 't'];
		});
	});
}

module.exports.handleSequence = function(index, message) {
	switch(index) {
		case 1:
		console.log('&&&&&&&&', _stepOne(message));
			return _stepOne(message);
	}
};
