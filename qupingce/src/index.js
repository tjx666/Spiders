const requests = require('superagent');
const constants = require('../config/constants');
const { logRequest } = require('./utils/request');

const main = async () => {
    const res = await requests.get(constants.getBandsByTypeUrl.replace('{type}', 'phone'));
    logRequest(res, true);
};

main();