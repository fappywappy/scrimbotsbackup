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

  if (!args.length) {
    return errorMsg(msg, 'Please provide a slot numbers.');
  };

  let slots = args.join(' ').split(' ');
  let invalidArgs = slots.some((num) => isNaN(num) || (num < 1))

  if (invalidArgs) {
    return errorMsg(msg, 'Please provide numbers greater than 0.');
  }
  
  if (slots.length > 30) {
    return errorMsg(msg, 'Please provide a max of 30 kills.');
  }


  for (let i = 0; i < 30; i++) {
    if (slots[i]) {
      bot.resources.teams[i].game1kills = slots[i];
    } else {
      bot.resources.teams[i].game1kills = 0;
    }
  }

  bot.game1kills = true;
  calculatePoints(bot);
  successMsg(msg, 'Game 1 kills recorded.');
  bot.updateTeams(bot);
}