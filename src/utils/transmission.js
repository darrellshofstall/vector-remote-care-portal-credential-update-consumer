const redoxTransmissionGetters = require('../database/read/redoxTransmission');
const { getReportTransmission } = redoxTransmissionGetters;

async function checkTransmissionAndStatus(reportId, redoxDestination) {
    const transmission = await getReportTransmission(
        reportId,
        redoxDestination.id
    );
    if (transmission.status === 'queued' || transmission.status === 'sucess') {
        const error =
            'Transmission is either queued or already sent for this report and destination';
        throw new Error(error);
    }
}

module.exports = {
    checkTransmissionAndStatus
};
