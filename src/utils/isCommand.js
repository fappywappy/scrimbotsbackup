module.exports = function (bot, msg) {
  const { COMMAND_PREFIX } = bot.config;
  const content = msg.content;

  const matchPrefix = content.startsWith(COMMAND_PREFIX);

  const rawCommand = content.split(' ')[0];
  const matchReaction = /^(\<:).*\>$/.test(rawCommand);

  return matchPrefix || matchReaction;
};