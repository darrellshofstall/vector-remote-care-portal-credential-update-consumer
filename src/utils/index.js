const { REDOX_SQS_URL } = process.env;
const clinicGetters = require('../database/read/clinic');
// const { getClinicRedoxDestination } = clinicGetters;
const sqs = require('../aws/sqs');

const redoxNamePathMap = {
    media: '/send-media-transmission',
    'media-tiff': '/send-media-tiff-transmission'
};

/**
 *
 * @param {number} reportId
 * @param {object} clinic
 * @param {object} redoxDestination
 * @returns {object}
 */
async function buildSqsMessageBody(reportId, clinic, redoxDestination) {
    const [
        clinicRedoxSearchDestination
    ] = await clinicGetters.getClinicRedoxDestination(clinic, 'search');

    return {
        path: getRedoxSqsPath(redoxDestination),
        httpMethod: 'POST',
        queryStringParameters: {
            reportId,
            clinicRedoxDestinationId: redoxDestination.id,
            clinicRedoxSearchDestinationId:
                (await isDemoImportTypePulled(clinic)) &&
                clinicRedoxSearchDestination
                    ? clinicRedoxSearchDestination.id
                    : null
        }
    };
}

/**
 *
 * @param {object} clinic
 * @returns {boolean}
 */
async function isDemoImportTypePulled(clinic) {
    const redoxDemoImportType = await clinicGetters.getClinicStringSetting(
        clinic,
        'REDOX_DEMOGRAPHIC_IMPORT_TYPE'
    );
    return redoxDemoImportType === 'pulled';
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
/**
 *
 * @param {number} reportId
 * @param {object} clinic
 * @param {object} redoxDestination
 */
async function buidAndSendSqsMessage(reportId, clinic, redoxDestination) {
    const messageBody = await buildSqsMessageBody(
        reportId,
        clinic,
        redoxDestination
    );
    await sqs.sendMessage(messageBody, REDOX_SQS_URL, 300);
}

module.exports = {
    getRedoxSqsPath,
    buildSqsMessageBody,
    buidAndSendSqsMessage
};
