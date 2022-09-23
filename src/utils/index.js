const clinicGetters = require('../database/read/clinic');
const { getClinicRedoxDestination } = clinicGetters;
const settingReportMap = {
    isRedoxReportReviewEnabled: 'clinicReviewedAt',
    isCoversheetSignatureEnabled: 'clinicSignedAt'
};
const redoxNamePathMap = {
    media: '/send-media-transmission',
    'media-tiff': '/send-media-tiff-transmission'
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
/**
 *
 * @param {number} reportId
 * @param {object} clinic
 * @param {object} redoxDestination
 * @returns {object}
 */
async function buildSqsMessageBody(reportId, clinic, redoxDestination) {
    const clinicRedoxSearchDestination = await getClinicRedoxDestination(
        clinic,
        'search'
    );
    return {
        path: getRedoxSqsPath(redoxDestination),
        httpMethod: 'POST',
        queryStringParameters: {
            reportId,
            clinicRedoxDestinationId: redoxDestination.id,
            clinicRedoxSearchDestinationId: clinicRedoxSearchDestination
                ? clinicRedoxSearchDestination.id
                : null
        }
    };
}
/**
 *
 * @param {object} redoxDestination
 * @returns {string}
 */
function getRedoxSqsPath(redoxDestination) {
    if (!redoxDestination) {
        throw new Error('No Redox destination provided');
    }
    const key = redoxDestination.RedoxModelType.name;
    return redoxNamePathMap[key];
}

module.exports = {
    hasRequiredColumns,
    coversheetDatesMatch,
    buildSqsMessageBody
};
