const saveResources = require('../database/saveResources');
const sendDM = require('../utils/sendDM');
const logEvent = require('../utils/logEvent');

module.exports = async function (bot) {
  setInterval(async () => {
    const msgs = await bot.requestsChannel.fetchMessages({limit: 99});

    const { requests } = bot.resources;

    for (let user_id in requests) {
      const request = requests[user_id];
      const msg_id = request.message_id;

      if (!msgs.has(msg_id)) {
        delete bot.resources.requests[user_id];
        saveResources(bot);

        sendDM(bot, user_id, 'It seems your request has been deleted.')
        logEvent(bot, `<@${user_id}>'s request has been deleted.`);
      }
    }
  }, 15000)
}