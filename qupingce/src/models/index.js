const path = require('path');
const fs = require('fs-extra');
const {
    log4js
} = require('../../config/log4jsConfig');
const log = log4js.getLogger('qupingce');

const createModels = () => {
    const models = [];
    const fileNames = fs.readdirSync(path.resolve(__dirname, '.'));
    console.log({
        fileNames
    });
    fileNames
        .filter(fileName => fileName !== 'index.js')
        .map(fileName => fileName.slice(0, -3))
        .forEach(modelName => {
            log.info(`Sequelize define model ${modelName}!`);
            models[modelName] = require(path.resolve(__dirname, `./${modelName}.js`));
        })
    return models;
}

module.exports = createModels();