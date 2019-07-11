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

sql.on('connect', () => {
  console.log('\nConnected to MySQL successfully');
});

sql.on('error', (err) => {
  console.error('\nMySQL Errored:');
  console.error(err);
});

var prefix = 'cn/';

function commandIs(str, msg) {
  return msg.content.toLowerCase().startsWith(prefix + str);
}

function load() {
  var _perm = fs.readFileSync('data.json', 'utf8');
  perm = JSON.parse(_perm);
}

function save() {
  var _perm = JSON.stringify(perm);
  fs.writeFileSync('data.json', _perm);
}

client.on('ready', async () => {
  // client.user.setActivity("crypticnode.host | cn/help");
  load();
  client.user.setActivity(">~< ignore me pls");
  client.user.setStatus('dnd');
  console.info(`\nLogged in as ${client.user.tag} as of ${current_time}.`);
});

client.on('message', async msg => {
  var args = msg.content.split(/[ ]+/);

  if (msg.content === 'opt out') {
    if (msg.channel.type === 'dm') {
      perm.cannopt[msg.author.id] = true;
      await save();
      msg.channel.send("Successfully opted you out of DM announcements");
    }
  }

  if (msg.content === 'opt in') {
    if (msg.channel.type === 'dm') {
      perm.cannopt[msg.author.id] = false;
      await save();
      msg.channel.send("Successfully opted you in to DM announcements");
    }
  } 
  
  if (commandIs('ping', msg)) {
    const m = await msg.channel.send(":ping_pong: Pinging...");
    m.edit(`:ping_pong: **Bot** ${m.createdTimestamp - msg.createdTimestamp}ms | **API** ${Math.round(client.ping)}ms`);
  }

  if (commandIs('cannounce', msg)) {
    if (!msg.member.hasPermission("MENTION_EVERYONE")) {
      msg.channel.send('You dont have permision to use this command.');
      return;
    }
    var members = client.guilds.get('509922203865710622').roles.get('564287766083403776').members;
    args.shift();
    var words = args.join(' ');
    console.log(members);
    for (var i = 1; i <= members.size; i++) {
      if (perm.cannopt[members.array()[i-1].id] == null) {
        perm.cannopt[members.array()[i-1].id] = false;
      }
      if (perm.cannopt[members.array()[i-1].id] != true) {
        console.log(members.array()[i-1].id);
        var cannounceembed = new Discord.RichEmbed()
          .setAuthor("", msg.author.avatarURL)
          .setColor("#169cdd")
          .addField(`Announcement by ${msg.author.username}`, words, true)
          .setFooter("If you wish to opt-out, just type in 'opt out'")
          .setTimestamp()
        client.users.get(members.array()[i-1].id).send(cannounceembed);
      }
    }
  }

  if (commandIs('t new', msg)) {
    const filter  = (msgg) => msgg.author.id == msg.author.id
    const id = await msg.channel.send('Whats the Topic?');
    var topic;
    await msg.channel.awaitMessages(filter, {max: 1, time: 10000}).then(collected => {
      console.log(collected);
      topic = collected.array()[0].cleanContent;
    });
    id.delete();
    i = msg.author.id.split('');
    i = i.slice(0, 4);
    i = i.join();
    msg.guild.createChannel(`ticket${i}-open`, {type: 'text', parent: '589821685671133197', topic: `Support Ticket for: ${msg.author.username}. Topic: ${topic}`}).then(channel => {
      channel.overwritePermissions(msg.author.id, {SEND_MESSAGES: true});
      channel.id
    });
    // .createChannel(`ticket-${i}`, {type: 'text', topic: `This is the ticket channel for ${msg.author.username}`, parent: '589821685671133197'});
  }

  if (commandIs('verify', msg)) {
    msg.channel.send('Verification is not available at the moment.\nThis feature will be available later on.');
   /* const m = await msg.author.send("Generating your Auth token...");
    var _link = "http://verify.crypticnode.host/error"

    
    var verifyembed = new Discord.RichEmbed()
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setDescription("This displays some basic information regarding your user.")
      .setColor("#991818")
      .addField("General", "**Username** - " + msg.author.username + "\n" + "**ID** - " + msg.author.id, true)
      .addField("Link", `[Click here](${_link})`)
      .setFooter("Requested by " + msg.author.username)
      .setTimestamp()
    m.edit(verifyembed); */
  } 

  if (commandIs('help', msg)) {
    const helpembed = new Discord.RichEmbed()
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setDescription("This will display a list of the current commands.")
      .setColor("#991818")
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
      .setColor("#991818")
      .addField("General", "**Username** - " + msg.author.username + "\n" + "**ID** - " + msg.author.id, true)
      .addField("Technical", "**Permissions** - " + msg.member.permissions + "\n" + "**Kickable?** - " + msg.member.kickable, true)
      .setFooter("Requested by " + msg.author.username)
      .setTimestamp()
    msg.channel.send(userinfoembed);
    return;
  }

}); // END

client.login(config.token);
