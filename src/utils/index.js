const settingReportMap = {
    isRedoxReportReviewEnabled: 'clinicReviewedAt',
    isCoversheetSignatureEnabled: 'clinicSignedAt'
};

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
 * Compares the reports coversheet_last_requested_at and coversheet_updated_at to make sure they are the same
 * @param {object} report
 * @returns {boolean}
 */
function coversheetDatesMatch(report) {
    return report.coversheetUpdatedAt && report.coversheetLastRequestedAt
        ? report.coversheetUpdatedAt === report.coversheetLastRequestedAt
        : false;
}

module.exports = {
    hasRequiredColumns,
    coversheetDatesMatch
};
