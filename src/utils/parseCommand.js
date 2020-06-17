module.exports = function (bot, msg) {
  const { COMMAND_PREFIX } = bot.config;
  const content = msg.content;

  const rawArgs = content.split(' ');
  const rawCommand = rawArgs.shift();

  const matchPrefix = content.startsWith(COMMAND_PREFIX);

  const command = (matchPrefix ?
    rawCommand.substring(COMMAND_PREFIX.length).toLowerCase() :
    rawCommand.substring(2, rawCommand.indexOf(':', 3)).toLowerCase()
  );

  const args = (rawArgs.length ? 
    rawArgs.join(' ').split(/[,]+/).map(e => e.trim()) :
    rawArgs
  );

  return [command, args];
};