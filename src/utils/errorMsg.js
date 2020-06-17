const { RichEmbed } = require('discord.js');

module.exports = function (msg, error) {
  const { channel } = msg;

  const embed = new RichEmbed();
  embed.setColor(0xff6961)
  embed.setDescription(error);
  
  channel.send(embed);
}