const stripIndent = require('strip-indent');
const { RichEmbed } = require('discord.js');

module.exports = function (bot, args, cmdMsg) {
  const { COMMAND_PREFIX: prefix } = bot.config

  cmdMsg.react('📫');

  const helpStr = stripIndent(`
  :sparkles: **Greetings!** :sparkles:

  The prefix to use my commands in server is \`${prefix}\`
  You can also use custom server emojis as commands.
  Example:  \`${prefix}serverinfo \`
  Example: \`:serverinfo:\`

  (argument) = Mandatory argument.
  [argument] = Optional argument.

  __General Commands__
  ~  **\\${prefix}requestcancel**- cancel your request to join a team.
  -  **\\${prefix}serverinfo**- server information, (member count, datetime of server creation, etc)
  ~  **\\${prefix}teamjoin (1-30)**- request to join a team corresponding with the slot number.
  ~  **\\${prefix}teamleave**- leave the team that you're in. 

  __Staff Commands (Only Useable By Staff Members)__
  ~  **\\${prefix}game1kills (slot 1 kills) [slot 2 kills]...**- records kills for game 1.
  ~  **\\${prefix}game1positions (1st place slot) [2nd place slot]...**- records positions for game 1.
  ~  **\\${prefix}game2kills (slot 1 kills) [slot 2 kills]...**- records kills for game 2. 
  ~  **\\${prefix}game2positions (1st place slot) [2nd place slot]...**- records positions for game 2.
  ~  **\\${prefix}game3kills (slot 1 kills) [slot 2 kills]...**- records kills for game 3. 
  ~  **\\${prefix}game3positions (1st place slot) [2nd place slot]...**- records positions for game 3.
  ~  **\\${prefix}requestsclear**- clears existing requests.
  ~  **\\${prefix}scrimend (override), (scrim name)**- set override to 'true' to override record requirement.
  ~  **\\${prefix}scrimreset**- clears all team statistics and exits the scrim.
  ~  **\\${prefix}scrimsignup (scrim name)**- notifies @everyone to sign up for scrims.
  ~  **\\${prefix}scrimstart (scrim name)**- starts a scrim (three games).
  ~  **\\${prefix}teamedit (1-30), (new team name)**- edit the name of a team corresponding with the slot number.
  ~  **\\${prefix}teammove (1-30), (1-30)**- moves a team from one slot number to another.
  ~  **\\${prefix}teamsclear**- clears players from all teams.
  ~  **\\${prefix}teamslock**- forbids members from making a request to join a team.
  ~  **\\${prefix}teamsunlock**- allows members from making a request to join a team.
  ~  **\\${prefix}usermove @user, (1-30)**- moves a user to the specified slot number.
  ~  **\\${prefix}userremove @user**- removes a user from their team.

  Server Invite Link: https://discord.gg/2t8bgTw
  `);

  cmdMsg.author.send(helpStr, {split: true});
}
