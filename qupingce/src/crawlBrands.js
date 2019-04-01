const requests = require('superagent');
const constants = require('../config/constants');
const models = require('./models');


const crawlBrands = async () => {
    const baseUrl = constants.getBandsByTypeUrl;
    const Brand = models.Brand;
    console.log(models);
    Brand.create({
        id: 666666,
        name: '苹果',
        type: 0
    })
}

crawlBrands();
