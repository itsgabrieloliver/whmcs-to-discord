const Discord = require("discord.js");
/* const whmcs = new WHMCS({
  username: '',
  password: '',
  apiKey: '',
  serverUrl: ''
 }); */
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
      msg.channel.send('<:errorhex:535607623710408734> You need to go into my DMs to verify this.');
    }
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

}); // End of stuff

client.login(config.token);
