const hasPermission = require('../../utils/hasPermission');
const errorMsg = require('../../utils/errorMsg');
const successMsg = require('../../utils/successMsg.js')
const logEvent = require('../../utils/logEvent');

const saveResources = require('../../database/saveResources');
const updateTeams = require('../../functions/updateTeams');

module.exports = async function (bot, args, msg) {
  const user_id = msg.author.id;
  const { INTEAM_ROLE } = bot.config;

  const { teams } = bot.resources;
  let found = false;

  for (let i = 0; i < teams.length; i++) {
    let { players } = teams[i];

    const inTeam = bot.resources.teams[i].players.some(playerID => playerID === user_id)
    if (inTeam) {
      bot.resources.teams[i].players = players.filter((player) => {
        if (player === user_id) {
          found = true;
          return false;
        };
        return true;
      })
    }
  }

  try {
    const member = await bot.guild.fetchMember(user_id);
    await member.removeRole(INTEAM_ROLE)
  } catch (e) { };

  if (!found) {
    return errorMsg(msg, `Removed the identifying role even though you were not in a team.`);
  }

  await saveResources(bot);
  await updateTeams(bot);


  successMsg(msg, `You have been successfully been removed from your team(s).`);
  logEvent(bot, `<@${user_id}>'s has left their team.`);
}