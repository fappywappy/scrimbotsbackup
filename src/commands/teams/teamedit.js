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

  if (args.length < 2) {
    return errorMsg(msg, 'Please provide a slot number and a new team name.\n Make sure they are separated by commas.');
  };

  const curSlot = args[0];
  const newName = args[1];

  if (isNaN(curSlot) || curSlot <= 0 || curSlot >= 31) {
    return errorMsg(msg, `${curSlot} is not a valid number between 1 and 30.`);
  };

  const url = curSlot <= 15 ? bot.team_panel_1.url : bot.team_panel_2.url;

  const oldName = bot.resources.teams[curSlot-1].name;
  bot.resources.teams[curSlot-1].name = newName;
  successMsg(msg, `${oldName} has been successfully renamed as [${newName}](${url}).`);
  logEvent(bot, `${oldName} has been renamed as [${newName}](${url}).`);
  saveResources(bot);
  updateTeams(bot);
}