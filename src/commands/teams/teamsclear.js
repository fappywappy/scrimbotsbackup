const hasPermission = require('../../utils/hasPermission');
const errorMsg = require('../../utils/errorMsg.js');
const successMsg = require('../../utils/successMsg.js');
const logEvent = require('../../utils/logEvent');

const saveResources = require('../../database/saveResources');
const updateTeams = require('../../functions/updateTeams');

module.exports = async function (bot, args, msg) {
  if (!hasPermission(bot, msg)) {
    return errorMsg(msg, `You don't have permission to run this command.`);
  };

  const { teams } = bot.resources;
  const { INTEAM_ROLE } = bot.config;

  for (let i = 0; i < teams.length; i++) {
    bot.resources.teams[i].players = [];
  }

  const role = bot.guild.roles.get(INTEAM_ROLE);
  role.members.tap(member => member.removeRole(role));

  successMsg(msg, `All teams have been cleared of [players](${bot.team_panel_1.url}).`);
  logEvent(bot, `All teams have been cleared of players.`);
  saveResources(bot);
  updateTeams(bot);
}