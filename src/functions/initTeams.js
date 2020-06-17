const { RichEmbed } = require('discord.js');

module.exports = async function (bot) {
  const { teamChannel } = bot;

  const embed = new RichEmbed();
  embed.setColor(0x36393E)
  embed.setDescription('Loading...');

  // If team panel message exists, edit it. Otherwise, create a new message.
  try {
    bot.team_panel_1 = await teamChannel.fetchMessage(bot.resources.meta.team_panel_1);
    bot.team_panel_1.edit(embed);
  } catch (e) {
    bot.team_panel_1 = await teamChannel.send(embed);
    bot.resources.meta.team_panel_1 = bot.team_panel_1.id;
  }

  // Do the same for panel 2.
  try {
    bot.team_panel_2 = await teamChannel.fetchMessage(bot.resources.meta.team_panel_2);
    bot.team_panel_2.edit(embed);
  } catch (e) {
    bot.team_panel_2 = await teamChannel.send(embed);
    bot.resources.meta.team_panel_2 = bot.team_panel_2.id;
  }

  bot.saveResources(bot);
}