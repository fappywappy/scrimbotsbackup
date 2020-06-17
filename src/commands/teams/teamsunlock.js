const { RichEmbed } = require('discord.js');
const stripIndent = require('strip-indent');

const errorMsg = require('../../utils/errorMsg.js');
const successMsg = require('../../utils/successMsg.js');
const clearRequests = require('../../utils/clearRequests.js');

module.exports = async function (bot, args, msg) {
  const { INTEAM_ROLE, COMMAND_PREFIX, TEAM_CHANNEL } = bot.config;

  if (!bot.isLocked) {
    return errorMsg(msg, `Scrims is already unlocked.`);
  };

  bot.isLocked = false;
  bot.updateTeams(bot);
  successMsg(msg, `Scrims is now unlocked.`);
}