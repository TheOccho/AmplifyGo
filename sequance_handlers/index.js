var api = require('../api');
var charts = require('../utils/charts');
var moment = require('moment');
var Bot  = require('@kikinteractive/kik');

function _chooseAccount(message) {
	// Fetch marketers
	return api.getMarketers().then(function(accounts) {
			var keyboards = [];
			for (var i=0; i < accounts.count; i++) {
				console.log('-------', global.userFlowMap, message.from , accounts.marketers[i].name, accounts.marketers[i].id);
				global.userFlowMap[message.from].accounts[accounts.marketers[i].name] = accounts.marketers[i].id;
				keyboards.push(accounts.marketers[i].name);
			}
			return {
				keyboards: keyboards,
				text: "Hello " + message.from + "! \nPlease choose an account:"
			};
	});
}

function _chooseCampaign(message) {
	global.userFlowMap[message.from].selections.account_name = message.body;
	var marketerId = global.userFlowMap[message.from].accounts[message.body];
	return api.getCampaigns(marketerId).then(function(campaigns) {
			var keyboards = [];
			for (var i=0; i < campaigns.count; i++) {
				keyboards.push(campaigns.campaigns[i].name);
				global.userFlowMap[message.from].campaigns[campaigns.campaigns[i].name] = {id:campaigns.campaigns[i].id, creationTime:campaigns.campaigns[i].creationTime, budget_id: campaigns.campaigns[i].budget.id};
			}
			return {
				keyboards: keyboards,
				text: "It looks like you typed in " + message.body + ". \nSelect the campaign name:"
			};
	});
}

function _chooseDate(message) {
	global.userFlowMap[message.from].selections.campaign_name = message.body;
	//var marketerId = global.userFlowMap[message.from].accounts[message.body];
	var keyboards = ["yesterday's spend", "today's spend", "month to date spend", "campaign to date spend"];
	return new Promise(function(resolve, reject) {
		resolve({
			keyboards: keyboards,
			text: "Select a date range:"
		});
	});
}

function _chooseCheckOptions(message) {
	var fromDate;
	var campaign_name = global.userFlowMap[message.from].selections.campaign_name;
	switch(message.body) {
 		case "yesterday's spend":
 			fromDate = moment().subtract(1, 'days');
 		case "today's spend":
 			fromDate = moment();
    case "month to date spend":
    	fromDate = moment().subtract(30,'days');
    case "campaign to date spend":
    	fromDate = global.userFlowMap[message.from].campaigns[campaign_name].creationTime;
    default:
   		fromDate = moment().subtract(1, 'days');
  }
	global.userFlowMap[message.from].selections.from_date = fromDate;
	//var marketerId = global.userFlowMap[message.from].accounts[message.body];
	var keyboards = ["Overview", "Trendline"];
	return new Promise(function(resolve, reject) {
		resolve({
			keyboards: keyboards,
			text: "What do you want to check?"
		});
	});
}

function _showOverviewTrendline(message) {
	if (message.body.toLowerCase() === "overview") {
		var campaign_name = global.userFlowMap[message.from].selections.campaign_name;
		var campaign_id = global.userFlowMap[message.from].campaigns[campaign_name].id;
		var from_date = global.userFlowMap[message.from].selections.from_date;
		var params = {from: from_date.format('YYYY-MM-DD'), to: moment().format('YYYY-MM-DD')};
		return api.getPerformanceByDay(campaign_id, params).then(function(data) {
			var text = "Here's summary for " + campaign_name + "\n cost: " + data.overallMetrics.cost + 
			"\n cpa: " + data.overallMetrics.cpa + 
			"\n ctr: " + data.overallMetrics.ctr + 
			"\n cpa: " + data.overallMetrics.cpa + 
			"\n clicks: " + data.overallMetrics.clicks + 
			"\n impressions: " + data.overallMetrics.impressions;
			message.reply(text);
			return {
					keyboards: ['Yes', 'No'],
					text: 'Would you like to update the budget for this campaign?'
				};
		});
	}
	else {
		global.bot.send(Bot.Message.picture(charts.getLineChart(require('../data/weekly_performance.json').details)), message.from);

		return new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve({
					keyboards: ['Yes', 'No'],
					text: 'Would you like to update the budget for this campaign?'
				});
			}, 500);
		});
	}
}

function _chooseBudget(message) {
	if (message.body.toLowerCase() === 'yes') {
		message.reply('Please enter the dollar amount.');
		return new Promise(function(resolve, reject) {
			resolve({noMessage: true});
		});
	} else {
		return _signOff(message);
	}
}

function _updateBudget(message) {
	var campaign_name = global.userFlowMap[message.from].selections.campaign_name;
	var budget_id = global.userFlowMap[message.from].campaigns[campaign_name].budget_id;
	return api.updateBudget(budget_id, +message.body).then(function(body) {
		message.reply('Budget successfully updated to $' + message.body);
		return new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve({
					keyboards: ['Yes', 'No'],
					text: message.from + ', is there anything else I can help you with today?'
				});
			}, 500);
		});
	});
}

function _signOff(message) {
	if (message.body.toLowerCase() == 'no') {
		message.reply('Goodbye, have a great '+ moment().format('dddd')+"!");
		return new Promise(function(resolve, reject) {
			resolve({noMessage: true});
		});
	}
}

module.exports.handleSequence = function(index, message) {
	switch(index) {
		case 1:
			return _chooseAccount(message);
		case 2:
			return _chooseCampaign(message);
		case 3:
			return _chooseDate(message);
		case 4:
			return _chooseCheckOptions(message);
		case 5:
			return _showOverviewTrendline(message);
		case 6:
			return _chooseBudget(message);
		case 7:
			return _updateBudget(message);
		case 8:
			return _signOff(message);
	}
};
