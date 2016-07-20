var api = require('../api');

function _stepOne() {

	// Fetch marketers
	return api.getMarketers().then(function(body) {
		const _marketerId = body.marketers[0].id;
		return api.getCampaigns(_marketerId).then(function(body) {
			// TODO: save to node storage
			console.dir(body.campaigns);
			var keyboards = [];
			for (var i=0; i < body.count; i++) {
				keyboards.push(body.campaigns[i].name);
			}
			return keyboards;
		});
	});
}

module.exports.handleSequence = function(index, message) {
	switch(index) {
		case 1:
		return _stepOne(message);
	}
};
