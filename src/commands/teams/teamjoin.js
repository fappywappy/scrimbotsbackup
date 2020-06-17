const { RichEmbed } = require('discord.js');

const errorMsg = require('../../utils/errorMsg.js');
const successMsg = require('../../utils/successMsg.js');
const logEvent = require('../../utils/logEvent');

const saveResources = require('../../database/saveResources');

module.exports = async function (bot, args, msg) {
  const { INTEAM_ROLE, COMMAND_PREFIX } = bot.config;

  if (bot.isLocked) {
    return errorMsg(msg, 'Joining teams is locked.');
  } 

  if (!args.length) {
    return errorMsg(msg, 'Please provide an slot number to join.');
  };

  const slotNum = args[0];

  if (isNaN(slotNum) || slotNum <= 0 || slotNum >= 31) {
    return errorMsg(msg, 'Please provide a valid number between 1 and 30.');
  };
  
  const { roles } = msg.member;
  const hasRole = roles.some(role => role.id === INTEAM_ROLE);

  if (hasRole) {
    return errorMsg(msg, `You have a role that indicates that you are already in a team.\n${COMMAND_PREFIX}teamleave to leave your team.`);
  }
  
  const { requestsChannel } = bot;
  const { requests } = bot.resources;
  const user_id = msg.author.id;
  
  if (requests.hasOwnProperty(user_id)) {
    try {
      const requestMsg = await requestsChannel.fetchMessage(requests[user_id].message_id);
      return errorMsg(msg, `You already have an [active request](${requestMsg.url}).\nUse ${COMMAND_PREFIX}requestcancel to cancel the existing request.`);
    } catch (e) {
      return errorMsg(msg, `You already have an active request.\nUse ${COMMAND_PREFIX}cancelrequest to cancel the existing request.`);
    }
  }

  const { teams } = bot.resources;
  const team = teams[slotNum-1];

  if (team.players.length >= 4) {
    return errorMsg(msg, `${team.name} is already full.`);
  }

  const author = msg.author;

  const embed = new RichEmbed();
  embed.setColor(0x36393E);
  embed.setDescription(`${author} has requested to join Slot ${slotNum} (${team.name}).`);

  
  const requestMsg = await requestsChannel.send(embed);
  successMsg(msg, `Request to join Slot ${slotNum} (${team.name}) [successfully made](${requestMsg.url}).`);
  logEvent(bot, `${author} made a request to join Slot ${slotNum} (${team.name}).`);

  bot.resources.requests[user_id] = {
    created_at: new Date(),
    message_id: requestMsg.id,
    slot_number: slotNum,
  }

  await requestMsg.react('✅');
  await requestMsg.react('❌');

  saveResources(bot);
}