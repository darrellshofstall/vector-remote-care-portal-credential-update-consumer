const reportGetters = require('./database/get/report');
const clinicGetters = require('./database/get/clinic');
const utils = require('./utils');
const { hasRequiredColumns, coversheetDatesMatch } = utils;
const {
    getClinicIntegrationSettings,
    getClinicById,
    getClinicRedoxDestination
} = clinicGetters;
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

        // check if there are pending or failed transmissions
        // queue the redox transmission
        // write a row in the transmissions table
    }
};
