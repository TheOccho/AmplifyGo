var Bot  = require('@kikinteractive/kik');
var request = require('request-promise');
var http = require('http');

var sequence_handler = require('./sequance_handlers');

var userFlowMap = {
	'dafna_gidony': {index:0, prev_keyboards:[]},
	'sbassal': {index:0, prev_keyboards:[]}
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
        		userFlowMap[user.id].index = 0;
            message.reply(`Hey ${user.firstName}!`);
        });
});


bot.onTextMessage(function(message) {
	console.log('(((&&&&)))', userFlowMap[message.from].prev_keyboards, message.body);
	//test if messagevalid value
	if (userFlowMap[message.from].prev_keyboards.indexOf(message.body) !== -1 || !userFlowMap[message.from].index){
    userFlowMap[message.from].index++;

    console.log('~~~~~SUCCESS~~~~~', userFlowMap[message.from].index);
		sequence_handler.handleSequence(userFlowMap[message.from].index, message).then(function(keyboards) {
			userFlowMap[message.from].prev_keyboards = keyboards;
			bot.send(Bot.Message.text("Choose a campaign:").addResponseKeyboard(keyboards),message.from);
		});
  }
  else{
		console.log('~~~~~ERROR!!!!!!~~~~~');
    message.reply('Choose again');
		bot.send(Bot.Message.text("Choose a campaign:").addResponseKeyboard(userFlowMap[message.from].prev_keyboards),message.from);
  }
	
});


var server = http
  .createServer(bot.incoming())
  .listen(process.env.PORT || 3000);
  