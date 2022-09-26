const settingReportMap = {
    isRedoxReportReviewEnabled: 'clinicReviewedAt',
    isCoversheetSignatureEnabled: 'clinicSignedAt'
};

/**
 * Compares the reports coversheet_last_requested_at and coversheet_updated_at to make sure they are the same
 * @param {object} report
 * @returns {boolean}
 */
function coversheetDatesMatch(report) {
    return report.coversheetUpdatedAt && report.coversheetLastRequestedAt
        ? report.coversheetUpdatedAt === report.coversheetLastRequestedAt
        : false;
}

/**
 * Takes a clinic's settings and make sure the corresponding report columns are truthy
 * @param {number} report
 * @param {object} clinicSettings
 * @returns {boolean}
 */
function hasRequiredColumns(report, clinicSettings) {
    return Object.keys(settingReportMap).every(key => {
        const reportColumn = settingReportMap[key];
        let isPassing = false;
        if (!clinicSettings[key]) {
            isPassing = true;
        } else {
            isPassing = !!report[reportColumn];
        }
        return isPassing;
    });
}
/**
 * Checks that a reports coversheet dates match and has the required columns filled out based on the clinic settings
 * @param {Object} report
 * @param {Object} clinicSettings
 * @returns {boolean}
 */
function isReportReadyToSend(report, clinicSettings) {
    let isPassing = true;
    if (!clinicSettings.isRedoxIntegrationEnabled) {
        isPassing = false;
        const error = 'Redox integrtion is not enabled';
        console.log(error);
    }
    if (isPassing && !coversheetDatesMatch(report)) {
        isPassing = false;
        const error = 'Coversheet dates dont match';
        console.log(error);
    }
    if (isPassing && !hasRequiredColumns(report, clinicSettings)) {
        isPassing = false;
        const error =
            'Report does not have all the required columns filled out';
        console.log(error);
    }
    return isPassing;
}

module.exports = {
    isReportReadyToSend,
    hasRequiredColumns,
    coversheetDatesMatch
};
