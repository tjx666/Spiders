const fs = require('fs-extra');
const path = require('path');


module.exports = class Repository {
    static async saveToLocal(repositories, indent = 2) {
        await fs.writeJSON(path.resolve(__dirname, '../../out/repositories.json'), repositories, { spaces: indent})
    }

    constructor({
        name,
        author,
        language,
        digest,
        starCount,
        lastUpdate,
    } = {}) {
        this.name = name;
        this.author = author;
        this.language = language;
        this.digest = digest;
        this.starCount = starCount;
        this.lastUpdate = lastUpdate;
    }

    display() {
        console.log(`   项目: ${this.name} 作者: ${this.author} 语言: ${this.language} star: ${this.starCount}
摘要: ${this.digest}
最后更新: ${this.lastUpdate}
`);
    }
}