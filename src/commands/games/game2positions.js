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
  let invalidArgs = slots.some((num) => isNaN(num) || (num < 1 || num > 30))

  if (invalidArgs) {
    return errorMsg(msg, 'Please provide numbers between 1 and 30.');
  }
  
  if (slots.length > 30) {
    return errorMsg(msg, 'Please provide a max of 30 slots.');
  }

  const givenSlots = [];

  for (let i = 0; i < slots.length; i++) {
    let slot = slots[i] - 1;
    givenSlots.push(slot);

    if (i > bot.config.PLACES.length - 2) {
      bot.resources.teams[slot].game2position = 0;
    } else {
      bot.resources.teams[slot].game2position = i + 1;
    }
  }

  for (let i = 0; i < 30; i++) {
    if (givenSlots.some((num) => num === i)) continue;
    bot.resources.teams[i].game2position = 0;
  }

  bot.game2positions = true;
  calculatePoints(bot);
  successMsg(msg, 'Game 2 positions recorded.');
  bot.updateTeams(bot);
}