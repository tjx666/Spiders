const Sequelize = require('sequelize');
const {log4js} = require('./log4jsConfig');
const log = log4js.getLogger('file');

const DATABASE = 'recycle';
const IDENTITY = 'root';
const PASSWORD = '12345678';

log.info(`Start connect to mysql, database: ${DATABASE}, as ${IDENTITY}!`)
const sequelize = new Sequelize(DATABASE, IDENTITY, PASSWORD, {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        // model 公共 options
        timestamps: false,

    },
    sync: {
        force: true
    }
})

sequelize
  .authenticate()
  .then(() => {
    log.info('Connect to mysql successfully!')
  })
  .catch(err => {
    log.error('Unable to connect to the mysql:', err);
  });


if (require.main === module) {
    //
} else {
    module.exports = {
        Sequelize,
        sequelize,
        Model: Sequelize.Model
    };
}