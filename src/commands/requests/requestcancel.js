const errorMsg = require('../../utils/errorMsg.js');
const successMsg = require('../../utils/successMsg.js');
const logEvent = require('../../utils/logEvent');

const saveResources = require('../../database/saveResources');

module.exports = async function (bot, args, msg) {
  const { requests } = bot.resources;
  const user_id = msg.author.id;

  if (!requests.hasOwnProperty(user_id)) {
    return errorMsg(msg, 'You have no active requests.');
  }

  try {
    const requestMsg = await bot.requestsChannel.fetchMessage(requests[user_id].message_id);
    requestMsg.delete();
  } catch (e) { };

  delete bot.resources.requests[user_id];
  saveResources(bot);

  successMsg(msg, 'Your request has been successfully cancelled.');
  logEvent(bot, `<@${user_id}>'s request has been cancelled.`);
}