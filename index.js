const Discord = require("discord.js");
const fs = require("fs");
const WHMCS = require("whmcs");
const whmcsconfig = { username: 'crypticnodebot', password: '213b1228250c04bc77b351182c0b3abd', apiKey: '56oCyD52n7hDVLrg2pkYKkPOEJjHPdim', serverUrl: 'https://payments.crypticnode.host/includes/api.php' };
const whmcsClient = new WHMCS(whmcsconfig);
const client = new Discord.Client();
const config = require("./config.json");
var perm = {};
var temp = {};
var date = new Date();
var current_date = date.getUTCDate();
var current_time = `${date.getUTCHours()}:${date.getUTCMinutes()}`;

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
  console.info(`\nLogged in as ${client.user.tag} as of ${current_time}.`);
});

client.on('ready', () => {
  client.user.setActivity("Checking... | crypticnode.host | cn/help");
  client.user.setStatus('idle');
  setInterval(function(){
  client.user.setActivity("Checking... | crypticnode.host | cn/help");
  whmcsClient.support.getTickets(function(err) {
    if (err) {
      client.user.setStatus('dnd');
      client.user.setActivity("Partial Outage | crypticnode.host | cn/help");
      return;
    }
    client.user.setActivity("crypticnode.host | cn/help");
    client.user.setStatus('online');
  });
  }, 10000);
});

  await load();
client.on('message', async msg => {
  var args = msg.content.split(/[ ]+/);
  
  if (commandIs('ping', msg)) {
    const m = await msg.channel.send(":ping_pong: Pinging...");
    m.edit(`:ping_pong: **Bot** ${m.createdTimestamp - msg.createdTimestamp}ms | **API** ${Math.round(client.ping)}ms`);
  }

  if (commandIs('verify', msg)) {
    if (msg.guild) {
        await msg.channel.send('<:infohex:535607624608251904> Please check direct messages I have sent you instructions.');
    }
    var verifynuminte = Math.round(Math.random()*999999);
    var verifynum = verifynuminte.toString();
    const embeded = new Discord.RichEmbed()
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .addField('Verification', 'In order to verify that you are a customer, please send a ticket to the **Verification** Department with the **The Subject** as:\n`' + verifynum + '`\nThen react to this message with a <:okhex:535607625493118986>')
      .setFooter('This expires in 5 minutes.')
      .setColor('#5b94ef')
      .setTimestamp();
    m = await msg.author.send(embeded);
    await m.react('535607625493118986');
    const filter = (reaction) => reaction.emoji.id === '535607625493118986'
    var collect;
    await m.awaitReactions(filter, {max: 2, time: 300000}).then(collected => collect = collected.array());
    if (!collect[0]) {
      msg.author.send("You were inactive or didn't send a ticket for over 5 minutes, so we cancelled your verification");
      return;
    }
    whmcsClient.support.getTickets(async function(err, tickets) {
      // {email: collect[0].cleanContent}
      if (err) {
        console.error('ERROR WHILES ATTEMPTING TO CONNECT TO WHMCS\n' + err);
        const embeded = new Discord.RichEmbed()
          .addField('<:errorhex:535607623710408734> Error', "Sorry. There was an Error whiles attempting to connect to the payment panel.\nIt's possible it might be offline right now, or it might be down for maintenance.")
          .setFooter('If this error continues to show up after 30 minutes, contact SysAdmin or Management.')
          .setColor('#f4424b')
          .setTimestamp();
        msg.author.send(embeded);
        return;
      }
      tickett = tickets.tickets.ticket
      var clientid = 0
      var i = 0
      while (clientid == 0 || tickett.length <= i) {
        if (tickett[i].deptid == 5) {
          if (tickett[i].subject == verifynum) {
            clientid = await tickett[i].userid;
          }
        }
        i = i + 1
      }
      if (clientid == 0) {
        const embeded = new Discord.RichEmbed()
          .addField('<:errorhex:535607623710408734> Error', "Sorry. There was an Error whiles attempting to find your profile.\nDid you:\n- Put the code in the **SUBJECT** instead of the message?\n- Copy the correct code\n- Send to the Verification Department?")
          .setFooter('If this error continues to show up, contact SysAdmin or Management.')
          .setColor('#f4424b')
          .setTimestamp();
        msg.author.send(embeded);
        return;
      }
      whmcsClient.customers.getCustomer(clientid, async function(err, data) {
        if (err) {
          const embeded = new Discord.RichEmbed()
            .addField('<:errorhex:535607623710408734> Error', "Sorry. There was an Error whiles attempting to connect to the payment panel.\nIt's possible it might be offline right now, or it might be down for maintenance.")
            .setFooter('If this error continues to show up after 30 minutes, contact SysAdmin or Management.')
            .setColor('#f4424b')
            .setTimestamp();
          msg.author.send(embeded);
          return;
        }
        const embeded = new Discord.RichEmbed()
          .addField(`Is this you, ${data.firstname}?`, `Full Name: ${data.fullname}\nEmail: ${data.email}\nPhone Number: ${data.phonenumberformatted}`)
          .setFooter("If this isn't you please deny this and contact SysAdmin.")
          .setColor('#5b94ef')
          .setTimestamp();
        var m = await msg.author.send(embeded);
        await m.react('535607625493118986');
        await m.react('535607623710408734');
        const filter = (reaction) => reaction.emoji.id === '535607625493118986'|'535607623710408734'
        await m.awaitReactions(filter, {max: 2, time: 30000}).then(collected => collect = collected.array());
        console.log(collect);
        var i = 1
        if (!collect[1]) {
          i = 0
        }
        if (collect[i].emoji.id == 535607625493118986) {
          const embededed = new Discord.RichEmbed()
            .addField(`Hello there, ${data.firstname}!`, `You've been successfully verified.`)
            .setFooter("Your `Verified` Rank has been added.")
            .setColor('#42f483')
            .setTimestamp();
          msg.author.send(embededed);
        } else {
          msg.channel.send("Our Auto-Verification system ran into an error and couldn't find you. Go ahead and open a ticket in the Verification Department, or ask on Discord to be added.");
        }
      });

    });
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

  if (commandIs('setstatuspage', msg)) {
    if (!msg.author.id == 189400912333111297) {
      msg.channel.send("<:errorhex:535607623710408734> You don't have permission to use this command.");
      return;
    }
    if (!args[1]) {
      perm.statuspage = null;
      msg.channel.send("<:infohex:535607624608251904> Your Status page has been reset.");
      save();
      return;
    }
    var servid = args[1].match(/\d/g);
    servid = servid.join("");
    perm.statuspage = servid;
    var statusembed = new Discord.RichEmbed()
      .setColor("#ff7f3f")
      .addField("Status", "**Testing 1** - <:okhex:535607625493118986> - Online\n**Testing 2** - <:warninghex:535607627045142528> - Degraded Performance\n**Testing 3** - <:errorhex:535607623710408734> - Outage")
      .setFooter("Refreshs every minute - TEST STATUS")
    client.channels.get(perm.statuspage).send(statusembed);
    save();
  }
});

client.login(config.token);
