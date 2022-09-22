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
function isReportSendable(report, clinicSettings) {
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

module.exports = {
    isReportSendable
};
