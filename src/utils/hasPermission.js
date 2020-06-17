const { RichEmbed } = require('discord.js');

module.exports = function (bot, msg) {
  const { ALLOWED_ROLES } = bot.config;
  const channel = msg.channel;
  const memberRoles = msg.member.roles;

  if (!ALLOWED_ROLES.length) return true;

  const hasPermission = memberRoles.some((role) => {
    return ALLOWED_ROLES.some(allowedID => role.id === allowedID);
  });

  return hasPermission;
};