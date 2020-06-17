const { RichEmbed } = require('discord.js');
const stripIndent = require('strip-indent');
const dateFormat = require('dateformat');

module.exports = function (bot, args, msg) {
  const channel = msg.channel;
  const { INFO } = bot.config.ICONS;
  const guild = bot.guild;

  const embed = new RichEmbed();
  embed.setColor(0x36393E);
  embed.setAuthor('Server Information', INFO)
  embed.setDescription(stripIndent(`
    Name: ${guild.name}
    Owner: ${guild.owner}
    Members: ${guild.memberCount}
    Region: ${guild.region}
    Created: ${dateFormat(guild.createdAt, "dddd, mmmm dS yyyy h:MM TT")}
  `));

  channel.send(embed);
}