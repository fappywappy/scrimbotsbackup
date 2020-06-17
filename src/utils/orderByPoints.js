const saveResources = require('../database/saveResources');

module.exports = async function (bot) {
  bot.resources.teams = bot.resources.teams.sort((a, b) => {
    return b.points - a.points;
  });
}