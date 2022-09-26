const clinicGetters = require('../database/read/clinic');
// const { getClinicRedoxDestination } = clinicGetters;
const sqs = require('../aws/sqs');
const { sendMessage } = sqs;

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
    await sendMessage(messageBody, 'url', 300);
}

module.exports = {
    getRedoxSqsPath,
    buildSqsMessageBody,
    buidAndSendSqsMessage
};
