const requests = require('superagent');
const cheerio = require('cheerio');
const util = require('util');
const path = require('path');
const fs = require('mz/fs');

let raw_url = `http://www.uyi2.com/albumMovieList?currentPage=%d&id=77`;

const crawl = async (currentPage=1) => {
    let url = util.format(raw_url, currentPage);
    const { text: html } = await requests.get(url);

    let $ = cheerio.load(html);
    const usefulScript = $('script')[0];
    const scriptStr = $(usefulScript).html();
    eval(scriptStr.replace('window.storage', 'global.storage'));

    const bookList = global.storage.albumMovieList.list;
    return bookList.map(element => {
        delete element.ishot;
        delete element.pic;
        return element;
    })
}


const main = async () => {
    let allBooks = [];
    for (let currentPage = 1; currentPage < 11; ++currentPage) {
        const bookList = await crawl(currentPage);
        allBooks.push(...bookList);
    }
    console.log(allBooks);
    const jsonPath = path.resolve(__dirname, './books.json');
    await fs.writeFile(jsonPath, JSON.stringify(allBooks, null, '    '));
}

if (require.main === module) {
   main();
} else {
    throw new Error('项目人口文件，不能作为模块导入。')
}