const { RichEmbed } = require('discord.js');

module.exports = async function (bot, userID, content) {
  try {
    const member = await bot.guild.fetchMember(userID);

    const embed = new RichEmbed();
    embed.setColor(0x36393E)
    embed.setDescription(content);
    
    member.send(embed);
  } catch (e) {};
}