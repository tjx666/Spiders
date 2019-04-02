const requests = require('superagent');
const models = require('./models');
const constants = require('../config/constants');
const requestUtil = require('./utils/request');
const logger = require('../config/log4jsConfig').log4js.getLogger('file');


const crawlBrands = async () => {
    const Brand = models.Brand;
    const baseUrl = constants.getBandsByTypeUrl;
    const imgReg = /\/GetFile\/getUploadImg\?fileName=(.+)\..+/;

    // 并发
    constants.types.forEach(async (type, index) => {
        const url = baseUrl.replace('{type}', type);
        const response = await requests.get(url);
        requestUtil.logRequest(response);
        
        if (response.body.msg && response.body.msg === '数据加载成功！') {
            logger.info(`访问 ${type} 数据成功!`);
            const brandArray = response.body.data;

            brandArray.forEach(async (brandData) => {
                const imgName = brandData.img.match(imgReg)[1];
                const newBrand = {
                    name: brandData.brandName,
                    type: index,
                    img_name: imgName,
                    brand_type_id: brandData.brandId,
                };
    
                try {
                    await Brand.create(newBrand)
                } catch (err) {
                    logger.error(`插入品牌数据: ${JSON.stringify(newBrand, null, 2)} 失败!`)
                    logger.error(err);
                }
            })
        }
    })
}

crawlBrands();
