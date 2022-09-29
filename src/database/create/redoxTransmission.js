const models = require('vector-sequelize-model');
const { RedoxTransmission } = models;
/**
 *
 * @param {number} reportId
 * @param {number} redoxDestinationId
 * @param {number} patientId
 * @returns {promise}
 */
async function createQueuedTransmission(
    reportId,
    redoxDestinationId,
    patientId
) {
    return RedoxTransmission.create({
        reportId,
        patientId,
        status: 'queued',
        redoxDestinationId
    });
}

module.exports = {
    createQueuedTransmission
};
