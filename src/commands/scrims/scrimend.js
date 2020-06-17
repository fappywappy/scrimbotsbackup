const { RichEmbed } = require('discord.js');
const stripIndent = require('strip-indent');

const errorMsg = require('../../utils/errorMsg.js');
const clearRequests = require('../../utils/clearRequests.js');
const orderByPoints = require('../../utils/orderByPoints.js');

module.exports = async function (bot, args, msg) {
  const { INTEAM_ROLE, COMMAND_PREFIX, TEAM_CHANNEL } = bot.config;
  msg.delete(500);

  if (!bot.inScrim) {
    return errorMsg(msg, `There must be a scrim active to use this command.`);
  };

  if (!args.length) {
    return errorMsg(msg, 'Please provide the scrim name.');
  };

  const override = args[0] === 'true';
  if (!bot.resultsRecorded && !override) {
    return errorMsg(msg, `Placement and kill results for all three games must be recorded.`);
  }

  const scrimName = args[1];

  orderByPoints(bot);
  const winningTeams = bot.resources.teams.slice(0, 5).filter(teams => teams.points !== 0);

  if (!winningTeams.length) {
    return errorMsg(msg, `No teams have any points.`);
  }

  let congratsStr = `**Congratulations to ${winningTeams[0].name} for winning ${scrimName}!**\n\n`;

  if (winningTeams.length === 1) {
    congratsStr += `${winningTeams[0].name} has secured a spot in the next scrim.`
  } else if (winningTeams.length > 1 && winningTeams.length < 5) {
    congratsStr += `These ${winningTeams.length} teams have secured a spot in the next scrim:\n`

    for (let i = 0; i < winningTeams.length; i++) {
      congratsStr += `• ${winningTeams[i].name}`
      if (i !== winningTeams.length - 1) congratsStr += '\n'
    }
  } else {
    congratsStr += `These ${winningTeams.length} teams have secured a spot in the next scrim:\n`

    for (let i = 0; i < 5; i++) {
      congratsStr += `• ${winningTeams[i].name}`
      if (i !== winningTeams.length - 1) congratsStr += '\n'
    }
  }

  const embed = new RichEmbed();
  embed.setColor(0x36393E);
  embed.setAuthor(`${scrimName} has ended!`, 'https://cdn3.iconfinder.com/data/icons/award-gray-set-1/100/award-13-512.png')
  embed.setDescription(congratsStr);

  const {teams} = bot.resources;

  for (let i = 0; i < 15; i++) {
    const team = bot.resources.teams[i];
    const { players } = bot.resources.teams[i];

    let emptyPlayersStr = '';
    for (let j = 0; j < 4 - players.length; j++) {
      emptyPlayersStr += '-';

      if (j < 4 - players.length - 1) emptyPlayersStr += '\n';
    }

    if (team.points) {
      const title = (i === 0) ? `◄  WINNERS | ${team.name}  ►` : `◄  Rank #${i + 1} | ${team.name}  ►`
      embed.addField(title, `**__Statistics__**\nGame 1: #${teams[i].game1position}\nGame 2: #${teams[i].game2position}\nGame 3: #${teams[i].game3position}\nKills: ${teams[i].game1kills + teams[i].game2kills + teams[i].game3kills}\nPoints: ${teams[i].points}\n\n**__Players__**\n` + 
      (players.reduce((str, p, idx) => {
        return str + `- <@${p}>${idx < players.length - 1 ? '\n' : (players.length === 4) ? '' : '\n'}`
      }, '')) + emptyPlayersStr + '\n--------------------------------', true);
    }
  }

  msg.channel.send(embed);
  msg.channel.send(`<@&${INTEAM_ROLE}>`).then(m => m.delete(1000));

  // Every team statistics cleared out.

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

  // Clear all but top five.
  const toRemoveUsers = [];
  for (let i = 5; i < teams.length; i++) {
    let team = teams[i];

    team.players.forEach((userID) => {
      toRemoveUsers.push(userID);
    });

    bot.resources.teams[i].players = [];
  }

  const role = bot.guild.roles.get(INTEAM_ROLE);
  const toRemoveMembers = role.members.filter((member) => {
    return toRemoveUsers.some(userID => member.id === userID);
  });

  toRemoveMembers.tap(member => member.removeRole(role));

  bot.saveResources(bot);
  bot.updateTeams(bot);
}