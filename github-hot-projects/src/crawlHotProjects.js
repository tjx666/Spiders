'use strict';
const requests = require('superagent');
const cheerio = require('cheerio');
const constants = require('../config/constants');
const logger = require('../config/log4jsConfig').log4js.getLogger('githubHotProjects');
const requestUtil = require('./utils/request');
const models = require('./models');

const crawlSourceCode = async (starCount, page = 1) => {
    // 下限为 starCount k star 数
    starCount = starCount * 1024;
    // 替换 url 中的参数
    const url = constants.searchUrl.replace('${starCount}', starCount).replace('${page}', page);
    // response.text 即为返回的源代码
    const {
        text: sourceCode
    } = await requestUtil.logRequest(requests.get(encodeURI(url)));
    return sourceCode;
}

/**
 * 返回搜索结果页面总共有多少页
 * @param {number} starCount star 数量下限
 */
const getPagesCount = async (starCount) => {
    const sourceCode = await crawlSourceCode(starCount);
    const $ = cheerio.load(sourceCode);

    const pageNavigatorSelector = '.paginate-container';
    const $pageNavigator = $(pageNavigatorSelector);

    let pageCount = 0;
    if ($pageNavigator.length === 0) {
        pageCount = 1;
    } else {
        const $pageLinks = $pageNavigator.find('a');
        const lastPageNumber = Number.parseInt($($pageLinks[$pageLinks.length - 2]).text().trim());
        pageCount = lastPageNumber;
    }

    return pageCount;
}

/**
 * 获取 star 数不低于 starCount k 的项目页表
 * @param {number} starCount star 数量下限
 * @param {number} page 页数
 */
const crawlProjectsByPage = async (starCount, page = 1) => {
    const sourceCode = await crawlSourceCode(starCount, page);
    const $ = cheerio.load(sourceCode);

    // 下面 cheerio 如果 jquery 比较熟应该没有障碍, 不熟的话 github 官方仓库可以查看 api, api 并不是很多
    // 查看 elements 面板, 发现每个仓库的信息在一个 li 标签内, 下面的代码时建议打开开发者工具的 elements 面板, 参照着阅读
    const repositoryLiSelector = '.repo-list-item';
    const repositoryLis = $(repositoryLiSelector);
    const repositories = [];
    repositoryLis.each((index, li) => {
        const $li = $(li);

        // 获取带有仓库作者和仓库名的 a 链接
        const nameLink = $li.find('h3 a');

        // 提取出仓库名和作者名
        const [author, name] = nameLink.text().split('/');

        // 获取项目摘要
        const digestP = $($li.find('p')[0]);
        const digest = digestP.text().trim();

        // 获取语言
        // 先获取类名为 .repo-language-color 的那个 span, 在获取包含语言文字的父 div
        // 这里要注意有些仓库是没有语言的, 是获取不到那个 span 的, language 为空字符串
        const languageDiv = $li.find('.repo-language-color').parent();
        // 这里注意使用 String.trim() 去除两侧的空白符
        const language = languageDiv.text().trim();

        // 获取 star 数量
        const starCountLinkSelector = '.muted-link';
        const links = $li.find(starCountLinkSelector);
        // 选择器为 .muted-link 还有可能是那个 issues 链接
        const starCountLink = $(links.length === 2 ? links[1] : links[0]);
        const starCount = starCountLink.text().trim();

        // 获取最后更新时间
        const lastUpdateElementSelector = 'relative-time';
        const lastUpdate = $li.find(lastUpdateElementSelector).text().trim();
        const repository = new models.Repository({
            name,
            author,
            language,
            digest,
            starCount,
            lastUpdate,
        });
        repositories.push(repository);
    });
    return repositories;
}


const crawlProjectsByPagesCount = async (starCount, pagesCount) => {
    if (pagesCount === undefined) {
        pagesCount = await getPagesCount(starCount);
        logger.warn(`未指定抓取的页面数量, 将抓取所有仓库, 总共${pagesCount}页`);
    }

    const allRepositories = [];

    const tasks = Array.from({
        length: pagesCount
    }, (ele, index) => {
        // 因为页数是从 1 开始的, 所以这里要 i + 1
        return crawlProjectsByPage(starCount, index + 1);
    });

    // 使用 Promise.all 来并发操作
    const resultRepositoriesArray = await Promise.all(tasks);
    resultRepositoriesArray.forEach(repositories => allRepositories.push(...repositories));
    return allRepositories;
}

if (require.main === module) {
    !async function test() {
        const repos = await crawlProjectsByPagesCount(50);
        console.log(JSON.stringify(repos, null, 2));
    }()
} else {
    module.exports = {
        crawlProjectsByPage,
        crawlProjectsByPagesCount,
    }
}