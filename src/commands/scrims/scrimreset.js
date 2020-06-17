const hasPermission = require('../../utils/hasPermission');
const errorMsg = require('../../utils/errorMsg.js');
const successMsg = require('../../utils/successMsg.js');
const logEvent = require('../../utils/logEvent');
const calculatePoints = require('../../utils/calculatePoints');

const saveResources = require('../../database/saveResources');
const updateTeams = require('../../functions/updateTeams');

module.exports = async function (bot, args, msg) {
  if (!hasPermission(bot, msg)) {
    return errorMsg(msg, `You don't have permission to run this command.`);
  };

  if (!bot.inScrim) {
    return errorMsg(msg, 'There must be a scrim active to use this command.');
  }

  bot.resources.teams = bot.resources.teams.map((team) => {
    return {
      name: team.name,
      players: team.players,
      points: 0,
      game1position: 0,
      game2position: 0,
      game3position: 0,
      game1kills: 0,
      game2kills: 0,
      game3kills: 0,
    }
  })

  bot.isLocked = false;
  bot.inScrim = false;
  bot.game1positions = false;
  bot.game2positions = false;
  bot.game3positions = false;
  bot.game1kills = false;
  bot.game2kills = false;
  bot.game3kills = false;
  bot.resultsRecorded = false;

  bot.saveResources(bot);
  successMsg(msg, 'Scrims has been reset.');
  bot.updateTeams(bot);
}