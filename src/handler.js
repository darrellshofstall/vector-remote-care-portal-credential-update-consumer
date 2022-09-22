const reportGetters = require('./database/get/report');
const clinicGetters = require('./database/get/clinic');
const utils = require('./utils');
const { hasRequiredColumns } = utils;
const { getClinicIntegrationSettings } = clinicGetters;
const { getReportById } = reportGetters;

module.exports.handler = async event => {
    console.log(event);
    const { reportId, clinicId } = event;
    const clinicSettings = await getClinicIntegrationSettings(clinicId);
    if (!clinicSettings.isRedoxIntegrationEnabled) {
        console.log(
            `Redox integration is not enabled for clinicId ${clinicId}`
        );
        return;
    }
    const report = await getReportById(reportId);
    if (hasRequiredColumns(report, clinicSettings)) {
        // check that the coversheet dates match
        // get clinics media destinations
        // check if there are pending or failed transmissions
        // queue the redox transmission
        // write a row in the transmissions table
    }
};
