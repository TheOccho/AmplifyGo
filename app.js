var Bot  = require('@kikinteractive/kik');
var request = require('request-promise');
var http = require('http');

var sequence_handler = require('./sequance_handlers');

global.userFlowMap = {
	'dafna_gidony': {index:0, prev_keyboards:[], accounts:{}, campaigns:{}, selections: {
		account_name: null,
		campaign_name: null,
		from_date: null
	}},
	'sbassal': {index:0, prev_keyboards:[], accounts:{}, campaigns:{}, selections: {
		account_name: null,
		campaign_name: null,
		from_date: null
	}},
	'theoccho': {index:0, prev_keyboards:[], accounts:{}, campaigns:{}, selections: {
		account_name: null,
		campaign_name: null,
		from_date: null
	}},
	'podipenay': {index:0, prev_keyboards:[], accounts:{}, campaigns:{}, selections: {
		account_name: null,
		campaign_name: null,
		from_date: null
	}}
};

global.bot = new Bot({
  username: 'dashbot',
  apiKey: process.env.KIK_API_KEY,
  baseUrl: process.env.KIK_BASE_URL
});

global.bot.updateBotConfiguration();

global.bot.onTextMessage(function(message) {
	console.log('(((&&&&)))', global.userFlowMap[message.from].prev_keyboards, message.body);

	if (global.userFlowMap[message.from].index == 6 && isNaN(message.body)) {
		return message.reply('Please enter a valid budget.');
	}
	//test if messagevalid value
	if (global.userFlowMap[message.from].prev_keyboards.indexOf(message.body) !== -1 || !global.userFlowMap[message.from].index || global.userFlowMap[message.from].index == 6){
    global.userFlowMap[message.from].index++;

    console.log('~~~~~SUCCESS~~~~~', global.userFlowMap[message.from].index);
		sequence_handler.handleSequence(global.userFlowMap[message.from].index, message).then(function(resp) {
			if (!resp.noMessage) {
				global.userFlowMap[message.from].prev_keyboards = resp.keyboards;
				global.bot.send(Bot.Message.text(resp.text).addResponseKeyboard(resp.keyboards),message.from);
			}
		});
  }
  else{
    message.reply('Choose again');
		global.bot.send(Bot.Message.text("Choose a campaign:").addResponseKeyboard(global.userFlowMap[message.from].prev_keyboards),message.from);
  }
	
});


var server = http
  .createServer(global.bot.incoming())
  .listen(process.env.PORT || 3000);
  