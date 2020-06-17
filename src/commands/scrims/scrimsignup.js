const { RichEmbed } = require('discord.js');
const stripIndent = require('strip-indent');

const errorMsg = require('../../utils/errorMsg.js');

module.exports = async function (bot, args, msg) {
  const { INTEAM_ROLE, COMMAND_PREFIX, TEAM_CHANNEL } = bot.config;

  if (!args.length) {
    return errorMsg(msg, 'Please provide a scrim name.');
  };

  const scrimName = args[0];

  const embed = new RichEmbed();
  embed.setColor(0x36393E);
  embed.setAuthor(`Signups for ${scrimName} has begun!`, 'https://www.shareicon.net/data/256x256/2016/06/28/624000_trophy_256x256.png')
  embed.setDescription(stripIndent(`
    Request to be part of a team by typing \`${COMMAND_PREFIX}teamjoin (1-30)\`.
    View teams in <#${TEAM_CHANNEL}>.
  `));
  
  msg.channel.send(embed);
  msg.delete(500);
} 