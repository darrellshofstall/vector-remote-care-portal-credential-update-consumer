const models = require('vector-sequelize-model');

/**
 *
 * @param {number} reportId
 * @param {number} redoxDestinationId
 * @returns {promise}
 */
async function getReportTransmission(reportId, redoxDestinationId) {
    return models.RedoxTransmission.findOne({
        where: {
            reportId,
            redoxDestinationId
        }
    });
}

module.exports = {
    getReportTransmission
};
