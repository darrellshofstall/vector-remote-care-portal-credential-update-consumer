const clinicGetters = require('./database/read/clinic');
const redoxTransmissionCreate = require('./database/create/redoxTransmission');
const utils = require('./utils');
const reportUtils = require('./utils/report');
const transmissionUtils = require('./utils/transmission');
const reportGetters = require('./database/read/report');
const { getReportById } = reportGetters;
const { buidAndSendSqsMessage } = utils;
const { isReportReadyToSend } = reportUtils;
const { getClinicAndSettings, getClinicMediaDestination } = clinicGetters;
const { checkTransmissionAndStatus } = transmissionUtils;

const { createQueuedTransmission } = redoxTransmissionCreate;

async function sendReport(event) {
    const { reportId, clinicId } = event;
    const { clinic, clinicSettings } = await getClinicAndSettings(clinicId);
    const report = await getReportById(reportId);
    if (await isReportReadyToSend(report, clinicSettings)) {
        const redoxDestination = await getClinicMediaDestination(clinic);
        await checkTransmissionAndStatus(reportId, redoxDestination.id);
        await buidAndSendSqsMessage(reportId, clinic, redoxDestination);
        const patientId = report.Device.PortalPatient.Patient.id;
        await createQueuedTransmission(
            reportId,
            redoxDestination.id,
            patientId
        );
    }
}

module.exports = {
    sendReport
};
