var Bot  = require('@kikinteractive/kik');
var request = require('request-promise');
var http = require('http');

var sequence_handler = require('./sequance_handlers');

var userFlowMap = {
	'dafna_gidony': 0
};

var bot = new Bot({
  username: 'dashbot',
  apiKey: process.env.KIK_API_KEY,
  baseUrl: process.env.KIK_BASE_URL
});

bot.updateBotConfiguration();

bot.onStartChattingMessage(function(message) {
	console.log('((())))))', message);
    bot.getUserProfile(message.from)
        .then((user) => {
        		userFlowMap[user.id] = 0;
            message.reply(`Hey ${user.firstName}!`);
        });
});

bot.onTextMessage(function(message) {
	//test if messagevalid value
	userFlowMap[message.from]++;
	console.log('~~~~~~~~~~', message);

	var keyboards = sequence_handler.handleSequence(userFlowMap[message.from], message);
	bot.send(Bot.Message.text("Choose a campaign:").addResponseKeyboard(keyboards),message.from);
});


var server = http
  .createServer(bot.incoming())
  .listen(process.env.PORT || 3000);
  