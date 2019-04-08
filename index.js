const Discord = require("discord.js");
// const whmcs = new WHMCS({
//  username: '',
//  password: '',
//  apiKey: '',
//  serverUrl: ''
// });
const client = new Discord.Client();
<<<<<<< HEAD
const settings = require("./config.json");
=======
const settings = require("./config.json")
>>>>>>> 042da789051a31d5668a800aa5763bbd4c687ac5
var temp = {};
var date = new Date();
var current_date = date.getUTCDate();
var current_time = `${date.getUTCHours()}:${date.getUTCMinutes()}`;

var prefix = 'cn/';

function commandIs(str, msg) {
  return msg.content.toLowerCase().startsWith(prefix + str);
}

client.on('ready', () => {
    console.info(`\nLogged in as ${client.user.tag} as of ${current_time}.`);
    client.user.setActivity("crypticnode.host | cn/help");
  });

client.on('message', async msg => {
  var args = msg.content.split(/[ ]+/);
  
  if (commandIs('ping', msg)) {
    const m = await msg.channel.send(":ping_pong: Pinging...");
    m.edit(`:ping_pong: **Bot** ${m.createdTimestamp - msg.createdTimestamp}ms | **API** ${Math.round(client.ping)}ms`);
  }

  if (commandIs('verify', msg)) {
    if (msg.guild) {
      msg.channel.send('<:errorhex:535607623710408734> You need to go into my DMs to verify this.');
    }
  }

}); // End of stuff

client.login(config.token);
