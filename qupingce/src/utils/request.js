const chalk = require('chalk');
const {log4js} = require('../../config/log4jsConfig');
const logger = log4js.getLogger('qupingce');

const logRequest = (response, isDetailed = false) => {
    const URL = chalk.underline.yellow(response.request.url);
    const basicInfo = `${response.request.method} Status: ${response.status} Content-Type: ${response.type} URL=${URL}`;
    if (!isDetailed) {
        logger.info(basicInfo);
    } else {
        const detailInfo = `${basicInfo}\ntext: ${response.text}`;
        logger.info(detailInfo);
    }
};

module.exports = {
    logRequest
};