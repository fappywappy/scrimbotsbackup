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
    return errorMsg(msg, 'Please provide a user to move and a slot number to move them to.\n Make sure the arguments are separated by commas.');
  };

  const rawUser = args[0];
  const matchID = rawUser.match(/\d+/);

  if (!matchID) {
    return errorMsg(msg, 'Please provide a valid user to remove.');
  }

  const user_id = matchID[0];

  const { teams } = bot.resources;
  let slotFound;

  for (let i = 0; i < teams.length; i++) {
    let { players } = teams[i];

    const inTeam = bot.resources.teams[i].players.some(playerID => playerID === user_id)
    if (inTeam) {
      bot.resources.teams[i].players = players.filter((player) => {
        if (player === user_id) {
          slotFound = i + 1;
          return false;
        } else {
          return true;
        }
      })
    }
  }

  const newSlot = args[1];

  if (isNaN(newSlot) || newSlot <= 0 || newSlot >= 31) {
    return errorMsg(msg, `${newSlot} is not a valid number between 1 and 30.`);
  };

  bot.resources.teams[newSlot - 1].players.push(user_id);
  const member = await bot.guild.fetchMember(user_id);
  member.addRole(bot.config.INTEAM_ROLE);

  const url = newSlot <= 15 ? bot.team_panel_1.url : bot.team_panel_2.url;

  if (slotFound === newSlot) {
    return errorMsg(msg, `${rawUser} is already in [Slot ${newSlot}](${url}).`);
  }

  successMsg(msg, `${rawUser} has successfully been moved to [Slot ${newSlot}](${url}).`);
  logEvent(bot, `${rawUser} has been moved to [Slot ${newSlot}](${url}).`);
  saveResources(bot);
  updateTeams(bot);
}