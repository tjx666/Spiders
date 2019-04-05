const {
    Sequelize,
    sequelize,
    Model
} = require('../../config/sequelizeConfig');

class Device extends Model {}
Device.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    type: {
        type: Sequelize.TINYINT,
        allowNull: false,
    },
    brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    max_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    min_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    memory: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    hard_disk: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    img_name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, { sequelize });

module.exports = Device;