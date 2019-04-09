const Discord = require("discord.js");
const WHMCS = require("whmcs");
const whmcsconfig = { username: 'crypticnodebot', password: '213b1228250c04bc77b351182c0b3abd', apiKey: '56oCyD52n7hDVLrg2pkYKkPOEJjHPdim', serverUrl: 'https://payments.crypticnode.host/includes/api.php' };
const whmcsClient = new WHMCS(whmcsconfig);
const client = new Discord.Client();
const config = require("./config.json");
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
        await msg.channel.send('<:infohex:535607624608251904> Please check direct messages I have sent you instructions.');
    }
    var verifynum = Math.round(Math.random()) * 999999
    const embeded = new Discord.RichEmbed()
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .addField('Verification', 'In order to verify that you are a customer, please send a ticket to the **Verification** Department with the code:\n`' + verifynum + '`\nThen react to this message with a <:okhex:535607625493118986>')
      .setFooter('This expires in 5 minutes.')
      .setColor('#5b94ef')
      .setTimestamp();
    m = await msg.author.send(embeded);
    await m.react('535607625493118986');
    const filter = (reaction) => reaction.emoji.id === '535607625493118986'
    var collect;
    await m.awaitReactions(filter, {max: 2, time: 300000}).then(collected => collect = collected.array());
    if (!collect[1]) {
      msg.author.send("You were inactive or didn't send an email for over 5 minutes, so we cancelled your verification");
      return;
    }
    whmcsClient.customers.getTickets('40', function(err, data) {
      // {email: collect[0].cleanContent}
      console.log(data);
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
      if (data.numreturned == 0) {
        const embeded = new Discord.RichEmbed()
          .addField('<:errorhex:535607623710408734> Error', "Sorry. There was an Error whiles attempting to find your profile.\nIt's possible you typed your email wrong.")
          .setFooter('If this error continues to show up, contact SysAdmin or Management.')
          .setColor('#f4424b')
          .setTimestamp();
        msg.author.send(embeded);
        return;
      }
      // use data pass this point
    });
    console.log(collect[0].cleanContent);
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
});

client.login(config.token);
