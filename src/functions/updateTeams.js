const { RichEmbed } = require('discord.js');

module.exports = async function (bot) {
  const { teams } = bot.resources;

  const embed = new RichEmbed();
  let authorText = bot.inScrim ? '' : 'SCRIM INACTIVE';
  const color = bot.inScrim ? 0x77dd77 : 0x36393E;

  if (bot.inScrim) {
    if (!bot.game1positions) {
      authorText += 'WAITING FOR GAME 1 PLACEMENT RESULTS'
    } else if (!bot.game1kills) {
      authorText += 'WAITING FOR GAME 1 KILL RESULTS'
    } else if (!bot.game2positions) {
      authorText += 'WAITING FOR GAME 2 PLACEMENT RESULTS'
    } else if (!bot.game2kills) {
      authorText += 'WAITING FOR GAME 2 KILL RESULTS'
    } else if (!bot.game3positions) {
      authorText += 'WAITING FOR GAME 3 PLACEMENT RESULTS'
    } else if (!bot.game3kills) {
      authorText += 'WAITING FOR GAME 3 KILL RESULTS'
    } else {
      bot.resultsRecorded = true;
      authorText += 'SCRIM RESULTS RECORDED - WAITING FOR STAFF'
    }
  }

  if (bot.isLocked) {
    authorText += ' | TEAMS LOCKED'
  } else {
    authorText += ' | TEAMS UNLOCKED'
  }

  authorText += ` | ${teams.reduce((sum, team) => sum + team.players.length, 0)}/120 PLAYERS`

  embed.setAuthor(authorText)
  embed.setColor(color);
  
  // Embed fields for team panel 1 (#1 - #15).
  for (let i = 0; i < 15; i++) {
    const { players } = teams[i];

    let emptyPlayersStr = '';
    for (let j = 0; j < 4 - players.length; j++) {
      emptyPlayersStr += '-';

      if (j < 4 - players.length - 1) emptyPlayersStr += '\n';
    }

    embed.fields[i] = {
      name: `◄  ${teams[i].name} | ${i + 1} ►`,
      value: `**__Statistics__**\nGame 1: #${teams[i].game1position}\nGame 2: #${teams[i].game2position}\nGame 3: #${teams[i].game3position}\nKills: ${teams[i].game1kills + teams[i].game2kills + teams[i].game3kills}\nPoints: ${teams[i].points}\n\n**__Players__**\n` + 
      (players.reduce((str, p, idx) => {
        return str + `- <@${p}>${idx < players.length - 1 ? '\n' : (players.length === 4) ? '' : '\n'}`
      }, '')) + emptyPlayersStr + '\n--------------------------------',
      inline: true,
    }
  }

  const { COMMAND_PREFIX } = bot.config;
  bot.team_panel_1.edit(embed);

  // Embed fields for team panel 2 (#16 - #30).
  for (let i = 0; i < 15; i++) {
    const { players } = teams[i+15];

    let emptyPlayersStr = '';
    for (let j = 0; j < 4 - players.length; j++) {
      emptyPlayersStr += '-';

      if (j < 4 - players.length - 1) emptyPlayersStr += '\n';
    }

    embed.fields[i] = {
      name: `◄  ${teams[i+15].name} | ${i + 16} ►`,
      value: `**__Statistics__**\nGame 1: #${teams[i+15].game1position}\nGame 2: #${teams[i+15].game2position}\nGame 3: #${teams[i+15].game3position}\nKills: ${teams[i+15].game1kills + teams[i+15].game2kills + teams[i+15].game3kills}\nPoints: ${teams[i+15].points}\n\n**__Players__**\n` + 
      (players.reduce((str, p, idx) => {
        return str + `- <@${p}>${idx < players.length - 1 ? '\n' : (players.length === 4) ? '' : '\n'}`
      }, '')) + emptyPlayersStr + '\n--------------------------------',
      inline: true,
    }
  }
  
  bot.team_panel_2.edit(embed);
}