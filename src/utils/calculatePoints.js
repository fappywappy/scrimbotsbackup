const saveResources = require('../database/saveResources');

module.exports = async function (bot) {
  for (let i = 0; i < bot.resources.teams.length; i++) {
    const team = bot.resources.teams[i];
    let points = 0;
    points += bot.config.PLACES[team.game1position];
    points += bot.config.PLACES[team.game2position];
    points += bot.config.PLACES[team.game3position];
    points += bot.config.KILL_POINTS * team.game1kills;
    points += bot.config.KILL_POINTS * team.game2kills;
    points += bot.config.KILL_POINTS * team.game3kills;

    bot.resources.teams[i].points = points;
  }
}