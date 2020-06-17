const saveResources = require('../database/saveResources');
const sendDM = require('../utils/sendDM');
const updateTeams = require('./updateTeams');
const logEvent = require('../utils/logEvent');

module.exports = async function (bot, rxn, user) {
  if (user.bot) return;
  if (rxn.message.channel.id !== bot.requestsChannel.id) return;

  const member = await bot.guild.fetchMember(user.id);
  const memberRoles = member.roles;

  const { ALLOWED_ROLES, INTEAM_ROLE } = bot.config;

  const hasPermission = memberRoles.some((role) => {
    return ALLOWED_ROLES.some(allowedID => role.id === allowedID);
  });

  const { requests } = bot.resources;

  let userID;

  if (rxn.emoji.name === '✅') {
    if (!hasPermission) return;

    for (let user_id in requests) {
      const request = requests[user_id];
      const msg_id = request.message_id;

      if (msg_id === rxn.message.id) {
        userID = user_id;
        break;
      }
    }

    if (!userID) {
      return rxn.message.delete();
    }

    const request = requests[userID];
    const slotNum = request.slot_number;
    const url = slotNum <= 15 ? bot.team_panel_1.url : bot.team_panel_2.url;

    const targetMember = await bot.guild.fetchMember(userID);

    bot.resources.teams[slotNum - 1].players.push(userID);
    updateTeams(bot);
    sendDM(bot, userID, `Your request to join [Slot ${slotNum}](${url}) has been approved.`);
    logEvent(bot, `<@${userID}>'s request to join [Slot ${slotNum}](${url}) has been approved.`);
    targetMember.addRole(INTEAM_ROLE);
  } else if (rxn.emoji.name === '❌') {
    // Allow request maker to delete their own request by pressing X.
    for (let user_id in requests) {
      const request = requests[user_id];
      const msg_id = request.message_id;

      if (msg_id === rxn.message.id) {
        userID = user_id;
        break;
      }
    }

    if (!userID) {
      return rxn.message.delete();
    }

    if (userID === user.id) {
      delete bot.resources.requests[userID];
      saveResources(bot);
      rxn.message.delete();
      sendDM(bot, userID, `Your request has been successfully cancelled.`);
      logEvent(bot, `<@${userID}>'s request to join [Slot ${slotNum}](${url}) has been cancelled.`);
      return;
    }

    if (!hasPermission) return;
    const request = requests[userID];
    const slotNum = request.slot_number;
    const url = slotNum <= 15 ? bot.team_panel_1.url : bot.team_panel_2.url;
    sendDM(bot, userID, `Your request to join [Slot ${slotNum}](${url}) has been denied.`);
    logEvent(bot, `<@${userID}>'s request to join [Slot ${slotNum}](${url}) has been denied.`);
  }

  delete bot.resources.requests[userID];
  saveResources(bot);
  rxn.message.delete();
}