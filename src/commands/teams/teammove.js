const hasPermission = require('../../utils/hasPermission');
const errorMsg = require('../../utils/errorMsg.js');
const successMsg = require('../../utils/successMsg.js');
const logEvent = require('../../utils/logEvent');

const saveResources = require('../../database/saveResources');
const updateTeams = require('../../functions/updateTeams');

function arraymove(arr, fromIndex, toIndex) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

module.exports = async function (bot, args, msg) {
  if (!hasPermission(bot, msg)) {
    return errorMsg(msg, `You don't have permission to run this command.`);
  };

  if (args.length < 2) {
    return errorMsg(msg, 'Please provide a current slot number and a new slot number to move the team to.\n Make sure they are separated by commas.');
  };

  const curSlot = args[0];
  const newSlot = args[1];

  if (isNaN(curSlot) || curSlot <= 0 || curSlot >= 31) {
    return errorMsg(msg, `${curSlot} is not a valid number between 1 and 30.`);
  };

  if (isNaN(newSlot) || newSlot <= 0 || newSlot >= 31) {
    return errorMsg(msg, `${newSlot} is not a valid number between 1 and 30.`);
  };

  if (curSlot === newSlot) {
    return errorMsg(msg, 'The new slot must be different from the current slot.');
  };

  const url = newSlot <= 15 ? bot.team_panel_1.url : bot.team_panel_2.url;

  arraymove(bot.resources.teams, curSlot-1, newSlot-1);
  successMsg(msg, `${bot.resources.teams[newSlot-1].name} successfully moved to [Slot ${newSlot}](${url}).`);
  logEvent(bot, `${bot.resources.teams[newSlot-1].name} has been moved to [Slot ${newSlot}](${url}).`);
  saveResources(bot);
  updateTeams(bot);
}