const chalk = require('chalk');
const { log4js } = require('../../config/log4jsConfig');
const logger = log4js.getLogger('githubHotProjects');

const logRequest = async (requestPromise, isDetailed = false) => {
    const URL = chalk.yellow.underline(requestPromise.url);
    const preUrl = chalk.bold.italic('URL=');
    const method = chalk.bgMagenta.bold(requestPromise.method)

    logger.info(`request ${method} ${URL} `);
    const start = Date.now();
    const response = await requestPromise;
    const end = Date.now();
    const timeout = end - start;

    const { status, type, body, text} = response;
    const statusStr = Math.trunc(status / 100) === 2 ? chalk.green(status) : chalk.red(status);
    const basicInfo = `response ${method} ${statusStr} ${type} ${preUrl}${URL} ${timeout}ms`;

    if (!isDetailed) {
        logger.info(basicInfo);
    } else {
        const detail = type === 'application/json'
            ? `body: ${JSON.stringify(body, null, 2)}`
            : `text: ${text}`;
        
        const detailInfo = `${basicInfo} ${detail}`;
        logger.info(detailInfo);
    }
    
    return response;
};


if (require.main === module) {
    const requests = require('superagent');
    const requestPromise = requests.get('https://github.com/search?q=stars:>2000&p=1&type=Repositories');
    logRequest(requestPromise);
} else {
    module.exports = {
        logRequest
    };
}