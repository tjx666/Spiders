const readlineSync = require('readline-sync');
const { crawlProjectsByPage, crawlProjectsByPagesCount } = require('./crawlHotProjects');
const models = require('./models');

const main = async () => {
    let isContinue = true;
    do {
        const starCount = readlineSync.questionInt(`输入你想要抓取的 github 上项目的 star 数量下限, 单位 k:`, { encoding: 'utf-8'});
        const crawlMode = [
            '抓取某一页',
            '抓取一定数量页数',
            '抓取所有页'
        ];
        const index = readlineSync.keyInSelect(crawlMode, '请选择一种模式');
        let repositories = [];
        switch (index) {
            case 0: {
                const page = readlineSync.questionInt('请输入你要抓取的具体页数:');
                repositories = await crawlProjectsByPage(starCount, page);
                break;
            }
            case 1: {
                const pagesCount = readlineSync.questionInt('请输入你要抓取的页面数量:');
                repositories = await crawlProjectsByPagesCount(starCount, pagesCount);
                break;
            }
            case 3: {
                repositories = await crawlProjectsByPagesCount(starCount);
                break;
            }
        }
        
        repositories.forEach(repository => repository.display());
        
        const isSave = readlineSync.keyInYN('请问是否要保存到本地(json 格式) ?');
        isSave && models.Repository.saveToLocal(repositories);

        isContinue = readlineSync.keyInYN('继续还是退出?');
    } while (isContinue);
    console.log('程序正常退出...');
}

main();