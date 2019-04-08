const Discord = require("discord.js");
const client = new Discord.Client();
var temp = {}
var date = new Date();
var current_date = date.getUTCDate();
var current_time = `${date.getUTCHours()}:${date.getUTCMinutes()}`

var prefix = 'cn/'

client.on('ready', () => {
    if (!client.shard) {
      console.info(`\nLogged in as ${client.user.tag} as of ${current_time}.`);
    }
    client.user.setActivity("Cryptic Node Bot");
  });

client.login('NTY0NjA1MDkxNjk3MzkzNjY0.XKqTgA.ZaFrcrv0yuViYh4I1Eqe8ScxcAM');