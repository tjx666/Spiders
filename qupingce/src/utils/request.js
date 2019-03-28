const util = require('util');
const chalk = require('chalk');

const logRequest = (response, isDetailed = false) => {
    const URL = chalk.underline.yellow(response.request.url);
    const basicInfo = `Status: ${response.status} Content-Type: ${response.type} URL=${URL}`;
    if (!isDetailed) {
        util.log(basicInfo);
    } else {
        const detailInfo = `${basicInfo}\ntext: ${response.text}`;
        util.log(detailInfo);
    }
};

module.exports = {
    logRequest
};