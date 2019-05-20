/*
  Name: CrypticNode - Verification Site
  Created by HexDev, Copyright 2019 (You must ask for permission before you can use this for commercial services).
  Created for: https://crypticnode.host/ & Optionally other sites
  Version: v2
*/
const Discord = require("discord.js");
const fs = require("fs");
const WHMCS = require("whmcs");
var mysql = require('mysql');
const whmcsconfig = { username: 'crypticnodebot', password: '213b1228250c04bc77b351182c0b3abd', apiKey: '56oCyD52n7hDVLrg2pkYKkPOEJjHPdim', serverUrl: 'https://payments.crypticnode.host/includes/api.php' };
const whmcsClient = new WHMCS(whmcsconfig);
const client = new Discord.Client();
const config = require("./config.json");
var perm = {};
var temp = {};
var date = new Date();
var current_date = date.getUTCDate();
var current_time = `${date.getUTCHours()}:${date.getUTCMinutes()}`;

var sql = mysql.createConnection({
  host     : '140.82.11.153',
  user     : 'u56_05R9ijqrFU',
  password : '39TW6qYl9pzhiS8i',
  database : 's56_cn_bot'
});

sql.connect();

var prefix = 'cn/';

function commandIs(str, msg) {
  return msg.content.toLowerCase().startsWith(prefix + str);
}

client.on('ready', async () => {
  // client.user.setActivity("crypticnode.host | cn/help");
  client.user.setActivity(">~< ignore me pls");
  client.user.setStatus('dnd');
  console.info(`\nLogged in as ${client.user.tag} as of ${current_time}.`);
});

client.on('message', async msg => {
  var args = msg.content.split(/[ ]+/);
  
  if (commandIs('ping', msg)) {
    const m = await msg.channel.send(":ping_pong: Pinging...");
    m.edit(`:ping_pong: **Bot** ${m.createdTimestamp - msg.createdTimestamp}ms | **API** ${Math.round(client.ping)}ms`);
  }

  if (commandIs('help', msg)) {
    const helpembed = new Discord.RichEmbed()
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setDescription("This will display a list of the current commands.")
      .setColor("RANDOM")
      .addField("General", "**cn/help** - " + "this will bring up the help menu." + "\n" + "**cn/userinfo** - " + "brings up info about the user." + "\n" +
      "**cn/report** - " + "reports a user to an admin." + "\n" + "**cn/verify - **" + "if completed you will get client discord tag." + "\n")
      
      /*.addField("Administration", "**;kick** - " + "kicks a user." + "\n" + "**;ban** - " + "bans a user." + "\n" + "**;warn** - " +
          "warns a user." + "\n" + "**;clear** - " + "clears the chat.")*/
      .setFooter("Requested by " + msg.author.username)
      .setTimestamp()

      msg.channel.send(helpembed);
      return;
  }

  if (commandIs('userinfo', msg)) {
    if (!msg.guild) {
      msg.channel.send("<:warninghex:535607627045142528> It appears you're not typing in CrypticNode's Discord. This command will not work unless you're typing in it.");
      return;
    }
    var userinfoembed = new Discord.RichEmbed()
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setDescription("This displays some basic information regarding your user.")
      .setColor("RANDOM")
      .addField("General", "**Username** - " + msg.author.username + "\n" + "**ID** - " + msg.author.id, true)
      .addField("Technical", "**Permissions** - " + msg.member.permissions + "\n" + "**Kickable?** - " + msg.member.kickable, true)
      .setFooter("Requested by " + msg.author.username)
      .setTimestamp()
    msg.channel.send(userinfoembed);
    return;
  }

}); // END

client.login(config.token);
