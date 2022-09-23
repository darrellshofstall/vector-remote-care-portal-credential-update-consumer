const reportGetters = require('./database/get/report');
const clinicGetters = require('./database/get/clinic');
const redoxTransmissionGetters = require('./database/get/redoxTransmission');
const utils = require('./utils');
const { hasRequiredColumns, coversheetDatesMatch } = utils;
const {
    getClinicIntegrationSettings,
    getClinicById,
    getClinicRedoxDestination
} = clinicGetters;
const { getReportTransmission } = redoxTransmissionGetters;
const { getReportById } = reportGetters;

module.exports.handler = async event => {
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
        const redoxDestination = await getClinicRedoxDestination(
            clinic,
            'media'
        );
        if (!redoxDestination) {
            console.log('No media destination found');
            return;
        }
        const transmission = await getReportTransmission(
            report.id,
            redoxDestination.id
        );
        if (
            transmission.status !== 'pending' ||
            transmission.status !== 'failed'
        ) {
            // create transmission row and queue transmission
        }
        // check if there are pending or failed transmissions
        // queue the redox transmission
        // write a row in the transmissions table
    }
};
