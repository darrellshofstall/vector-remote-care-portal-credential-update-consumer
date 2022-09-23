const reportGetters = require('./database/read/report');
const clinicGetters = require('./database/read/clinic');
const redoxTransmissionCreate = require('./database/create/redoxTransmission');
const redoxTransmissionGetters = require('./database/read/redoxTransmission');
const utils = require('./utils');
const sqs = require('./aws/sqs');
const { sendMessage } = sqs;
const { hasRequiredColumns, coversheetDatesMatch, buildSqsMessageBody } = utils;
const {
    getClinicIntegrationSettings,
    getClinicById,
    getClinicRedoxDestination
} = clinicGetters;
const { getReportTransmission } = redoxTransmissionGetters;
const { getReportById } = reportGetters;
const { createQueuedTransmission } = redoxTransmissionCreate;

async function sendReport(event) {
    console.log(event);
    const { reportId, clinicId } = event;
    const clinic = await getClinicById(clinicId);
    const clinicSettings = await getClinicIntegrationSettings(clinic);
    if (!clinicSettings.isRedoxIntegrationEnabled) {
        console.log(
            `Redox integration is not enabled for clinicId ${clinicId}`
        );
        return;
    }
    const report = await getReportById(reportId);
    if (!coversheetDatesMatch(report)) {
        console.log('Coversheet dates dont match');
        return;
    }
    if (hasRequiredColumns(report, clinicSettings)) {
        const redoxDestination = await getClinicRedoxDestination(clinic, [
            'media',
            'media-tiff'
        ]);
        if (!redoxDestination) {
            console.log('No media destination found');
            return;
        }
        const transmission = await getReportTransmission(
            report.id,
            redoxDestination.id
        );
        if (
            transmission.status === 'queued' ||
            transmission.status === 'sucess'
        ) {
            console.log(
                'Transmission is either queued or already sent for this report and destination'
            );
            return;
        }
        const messageBody = await buildSqsMessageBody(
            reportId,
            clinic,
            redoxDestination
        );
        await sendMessage(messageBody, 'url', 300);
        await createQueuedTransmission();
        return 'true';
    }
}

module.exports = {
    sendReport
};
