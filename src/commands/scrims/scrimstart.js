const { RichEmbed } = require('discord.js');
const stripIndent = require('strip-indent');

const errorMsg = require('../../utils/errorMsg.js');
const clearRequests = require('../../utils/clearRequests.js');

module.exports = async function (bot, args, msg) {
  const { INTEAM_ROLE, COMMAND_PREFIX, TEAM_CHANNEL } = bot.config;
  msg.delete(500);

  if (bot.inScrim) {
    return errorMsg(msg, `There is a scrim active already. ${COMMAND_PREFIX}scrimend or ${COMMAND_PREFIX}scrimreset to end the scrim.`);
  };

  if (!args.length) {
    return errorMsg(msg, 'Please provide a scrim name.');
  };

  const scrimName = args[0];

  const embed = new RichEmbed();
  embed.setColor(0x36393E);
  embed.setAuthor(`${scrimName} is now starting!`, 'https://cdn3.iconfinder.com/data/icons/automobile-street/30/race-flag-512.png')
  embed.setDescription(stripIndent(`
    View the current roster in <#${TEAM_CHANNEL}>.
    Good luck and have fun!
  `));
  
  msg.channel.send(embed);
  msg.channel.send(`<@&${INTEAM_ROLE}>`).then(m => m.delete(1000));

  let { teams } = bot.resources;
  let sortedTeams = [];
  for (let team of teams) {
    if (!team.players.length) sortedTeams.push(team);
    else sortedTeams.unshift(team);
  }
  
  bot.resources.teams = sortedTeams;
  bot.saveResources(bot);
  bot.isLocked = true;
  bot.inScrim = true;
  bot.updateTeams(bot);
  clearRequests(bot);
}