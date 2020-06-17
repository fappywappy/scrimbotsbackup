const { InfoModel } = require('./models');

module.exports = async function (bot) {
  return await InfoModel.findOneAndUpdate({}, {}, { upsert: true, setDefaultsOnInsert: true, new: true, useFindAndModify: false }, async (err, result) => {
    if (err) console.log(err);
    return await result;
  });
}