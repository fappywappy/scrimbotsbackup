const { RichEmbed } = require('discord.js');

module.exports = function (bot, content) {
  const { logChannel } = bot;

  const embed = new RichEmbed();
  embed.setColor(0xff6961)
  embed.setDescription(content);
  
  logChannel.send(embed);
}