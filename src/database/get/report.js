const models = require('vector-sequelize-model');
async function getReportById(reportId, where = {}) {
    return models.Report.findByPk(reportId, {
        where
    });
}

module.exports = {
    getReportById
};
