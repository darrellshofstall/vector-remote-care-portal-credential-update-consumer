const redoxTransmissionGetters = require('../database/read/redoxTransmission');

async function checkTransmissionAndStatus(reportId, redoxDestination) {
    let result = true;
    const transmission = await redoxTransmissionGetters.getReportTransmission(
        reportId,
        redoxDestination.id
    );
    if (transmission.status === 'queued' || transmission.status === 'sucess') {
        result = false;
        const error =
            'Transmission is either queued or already sent for this report and destination';
        console.log(error);
    }
    return result;
}

module.exports = {
    checkTransmissionAndStatus
};
