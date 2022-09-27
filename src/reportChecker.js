const clinicGetters = require('./database/read/clinic');
const redoxTransmissionCreate = require('./database/create/redoxTransmission');
const utils = require('./utils');
const reportUtils = require('./utils/report');
const transmissionUtils = require('./utils/transmission');
const reportGetters = require('./database/read/report');

async function sendReport(event) {
    const { reportId, clinicId } = event;
    const { clinic, clinicSettings } = await clinicGetters.getClinicAndSettings(
        clinicId
    );
    const report = await reportGetters.getReportById(reportId);
    if (await reportUtils.isReportReadyToSend(report, clinicSettings)) {
        const redoxDestination = await clinicGetters.getClinicMediaDestination(
            clinic
        );
        await transmissionUtils.checkTransmissionAndStatus(
            reportId,
            redoxDestination.id
        );
        await utils.buidAndSendSqsMessage(reportId, clinic, redoxDestination);
        const patientId = report.Device.PortalPatient.Patient.id;
        await redoxTransmissionCreate.createQueuedTransmission(
            reportId,
            redoxDestination.id,
            patientId
        );
    }
}

module.exports = {
    sendReport
};
