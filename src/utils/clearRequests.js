const saveResources = require('../database/saveResources');

module.exports = async function (bot) {
  await bot.requestsChannel.bulkDelete(100, true);
  bot.resources.requests = {};
  saveResources(bot);
}