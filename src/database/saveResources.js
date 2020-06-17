const { InfoModel } = require('./models');

module.exports = function (bot) {
  const query = {};
  const updateObj = bot.resources;
  const options = { upsert: true, setDefaultsOnInsert: true, new: true, useFindAndModify: false };
  const errHandler = (err) => {
    if (err) console.log(err);
  };

  InfoModel.findOneAndUpdate(query, updateObj, options, errHandler);
}