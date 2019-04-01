const {
    Sequelize,
    sequelize,
    Model
} = require('../../config/sequelizeConfig');

class Brand extends Model {}
Brand.init({
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
    }
}, {
    sequelize
})

module.exports = Brand;