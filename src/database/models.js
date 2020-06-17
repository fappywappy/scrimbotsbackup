const mongoose = require('mongoose');

const defaultString = { type: String, default: '' };
const defaultStringArray = { type: [String], default: [] };

const teamsSchema = mongoose.Schema({
  name: defaultString,
  players: defaultStringArray,
  points: Number,
  game1position: Number,
  game2position: Number,
  game3position: Number,
  game1kills: Number,
  game2kills: Number,
  game3kills: Number,
});

const metaSchema = mongoose.Schema({
  team_panel_1: defaultString,
  team_panel_2: defaultString,
});

const infoSchema = mongoose.Schema({
  requests: {
    type: {
      request: {
        created_at: Date,
        message_id: String,
        slot_number: String,
      }
    }, default: {}
  },
  teams: [teamsSchema],
  meta: metaSchema,
}, { minimize: false }); // Minimize set to false srevents deletion of empty objects.

const InfoModel = mongoose.model('info', infoSchema);

module.exports = { InfoModel };
