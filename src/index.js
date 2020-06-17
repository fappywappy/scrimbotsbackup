require('dotenv').config()
const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');

// Bot functions.
const setMemberVariables = require('./functions/setMemberVariables');
const initTeams = require('./functions/initTeams');
const updateTeams = require('./functions/updateTeams');
const checkRequests = require('./functions/checkRequests');
const checkDelete = require('./functions/checkDelete');
const checkReaction = require('./functions/checkReaction');

// Database functions.
const initDatabase = require('./database/initDatabase');
const saveResources = require('./database/saveResources');

// Utility functions.
const isCommand = require('./utils/isCommand');
const parseCommand = require('./utils/parseCommand');
const loadCommands = require('./utils/loadCommands');

const COMMANDS = loadCommands();

class Bot {
  constructor(config) {
    // Setup bot variables/methods.
    this.client = new Discord.Client();
    this.config = config;
    this.saveResources = saveResources;
    this.updateTeams = updateTeams;
    this.isLocked = false;
    this.inScrim = false;
    this.game1positions = false;
    this.game2positions = false;
    this.game3positions = false;
    this.game1kills = false;
    this.game2kills = false;
    this.game3kills = false;
    this.resultsRecorded = false;
    //
  }

  async init() {
    // Connect to the database server.
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

    // Initial database load.
    this.resources = await initDatabase();

    // Initiate teams if does not exist.
    if (this.resources.teams.length !== 30) {
      const initArr = [];

      for (let i = 0; i < 30; i++) {
        initArr.push({
          name: `${i + 1}`,
          players: [],
        })
      }

      this.resources.teams = initArr;
      this.saveResources(this);
    }

    // Login to Discord.
    this.client.login(process.env.TOKEN);

    // Event handlers for the bot.
    this.client.on('message', (msg) => this.message(msg));
    this.client.on('messageDelete', (msg) => this.messageDelete(msg));
    this.client.on('messageReactionAdd', (rxn, user) => this.messageReactionAdd(rxn, user));
    this.client.on('ready', () => this.ready());
    this.client.on('rateLimit', (info) => this.rateLimit(info));
  }

  async ready() {
    // Successfully logged into Discord.
    console.log(`Logged in as ${this.client.user.tag}!`);

    // Set the bot activity.
    this.client.user.setActivity(`${this.config.COMMAND_PREFIX}help`);

    // Set the bot guild and channel variables.
    await setMemberVariables(this);

    // Initiate and update the team panels.
    await initTeams(this);
    await updateTeams(this);

    setInterval(updateTeams, 30000, this);

    // Check requests to see if any of them got deleted.
    await checkRequests(this);
  }

  message(msg) {
    // Returns if the sender is a bot, message is not from a text channel,
    // or if sender has insufficient permissions.
    if (msg.author.bot) return;
    if (msg.channel.type !== 'text') return;
    if (!isCommand(this, msg)) return;

    // Separate the message content into commands and arguments.
    const [command, args] = parseCommand(this, msg);

    // Matches the command to its file in './commands'.
    if (command in COMMANDS) {
      COMMANDS[command](this, args, msg);
    }
  }

  messageDelete(msg) {
    // Check if it was a request that was deleted.
    checkDelete(this, msg);
  }

  messageReactionAdd(rxn, user) {
    // Check reaction logic.
    checkReaction(this, rxn, user);
  }

  rateLimit(info) {
    console.log(`You're being rate limited.`);
    console.log(info);
  }
}

// Please make sure config.json fields are valid.
const config = JSON.parse(fs.readFileSync('config.json'));
new Bot(config).init();

// Uncaught promise rejection handler.
process.on('unhandledRejection', (r, p) => {
  console.error('Unhandled Rejection at:', p)
});
