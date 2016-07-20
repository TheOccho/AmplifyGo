//var express = require('express');
var Bot  = require('@kikinteractive/kik');
var request = require('request-promise');
var http = require('http');
//var app = express();
var api = require('./api');

var bot = new Bot({
  username: 'dashbot',
  apiKey: process.env.KIK_API_KEY,
  baseUrl: process.env.KIK_BASE_URL
});

bot.updateBotConfiguration();

bot.onTextMessage(function(message) {
	console.log('~~~~~~~~~~', message);
  message.reply(message.body);
});

// Fetch marketers
// api.getMarketers().then(function(body) {
//   const _marketerId = body.marketers[0].id;
//   api.getCampaigns(_marketerId).then(function(body) {
//     console.dir(body);
//   });
// });

var server = http
  .createServer(bot.incoming())
  .listen(process.env.PORT || 3000);
  