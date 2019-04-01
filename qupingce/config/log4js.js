const log4js = require('log4js');
const path = require('path');
const fs = require('fs-extra');

const infoFilePath = path.resolve(__dirname, '../log/info.log');
const errorFilePath = path.resolve(__dirname, '../log/error.log');
log4js.configure({
    appenders: {
        dateFile: {
            type: 'dateFile',
            filename: infoFilePath,
            pattern: 'yyyy-MM-dd',
            compress: false
        },
        errorDateFile: {
            type: 'dateFile',
            filename: errorFilePath,
            pattern: 'yyyy-MM-dd',
            compress: false,
        },
        justErrorsToFile: {
            type: 'logLevelFilter',
            appender: 'errorDateFile',
            level: 'error'
        },
        out: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['out'],
            level: 'trace'
        },
        file: {
            appenders: ['out', 'dateFile', 'justErrorsToFile'],
            level: 'trace'
        }
    }
});


const clear = async () => {
    const files = await fs.readdir(path.resolve(__dirname, '../log'));
    for (const fileName of files) {
        fs.remove(path.resolve(__dirname, `../log/${fileName}`));
    }
}


module.exports = {
    log4js,
    clear
}

