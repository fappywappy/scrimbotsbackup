const fs = require('fs');

module.exports = function () {
  const groups = fs.readdirSync('./src/commands');

  const COMMANDS = [];

  for (let group of groups) {
    const isDirectory = fs.statSync(`./src/commands/${group}`).isDirectory();

    if (isDirectory) {
      const commands = fs.readdirSync(`./src/commands/${group}`);
      const jsRegex = /^\w+(?=.(js|mjs|jsx|ts|tsx)$)/;

      for (let command of commands) {
        const isFile = fs.statSync(`./src/commands/${group}/${command}`).isFile();
        const isJavascript = jsRegex.test(command);

        if (isFile && isJavascript) {
          const name = jsRegex.exec(command)[0].split('.')[0];
          const pathToFile = `../commands/${group}/${name}.js`;

          try {
            COMMANDS[name] = require(pathToFile);
          } catch (e) {
            console.log(`Unable to load '${pathToFile}'`);
            console.log(e);
          }

        }
      }
    }
  }

  return COMMANDS;
}