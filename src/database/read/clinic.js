const models = require('vector-sequelize-model');
/**
 *
 * @param {number} clinicId
 * @returns {{isRedoxReportReviewEnabled: boolean, isCoversheetSignatureEnabled: boolean, , isRedoxIntegrationEnabled: boolean}}
 */
async function getClinicIntegrationSettings(clinic) {
    const isRedoxReportReviewEnabled = await getClinicBooleanSetting(
        clinic,
        'IS_REDOX_REPORT_REVIEW_ENABLED'
    );
    const isCoversheetSignatureEnabled = await getClinicBooleanSetting(
        clinic,
        'IS_COVERSHEET_SIGNATURE_ENABLED'
    );
    const isRedoxIntegrationEnabled = await getClinicBooleanSetting(
        clinic,
        'IS_REDOX_INTEGRATION_ENABLED'
    );
    return {
        isRedoxReportReviewEnabled,
        isCoversheetSignatureEnabled,
        isRedoxIntegrationEnabled
    };
}
/**
 *
 * @param {number} clinicId
 * @returns {object}
 */
async function getClinicById(clinicId) {
    return models.Clinic.findByPk(clinicId);
}
/**
 *
 * @param {object} clinic
 * @returns {object}
 */
async function getClinicRedoxDestination(clinic, modelName) {
    return await clinic.getRedoxDestinations({
        where: {
            isActive: true
        },
        include: [
            {
                model: models.RedoxModelType,
                required: true,
                where: {
                    name: modelName,
                    isActive: true
                }
            }
        ]
    });
}
/**
 *
 * @param {object} clinic
 * @param {string} settingName
 * @returns {boolean}
 */
async function getClinicBooleanSetting(clinic, settingName) {
    return await clinic.getBooleanSetting(settingName);
}

async function getClinicAndSettings(clinicId) {
    const clinic = await getClinicById(clinicId);
    const clinicSettings = await getClinicIntegrationSettings(clinic);
    return { clinic, clinicSettings };
}
/**
 *
 * @param {object} clinic
 * @returns {object}
 */
async function getClinicMediaDestination(clinic) {
    const redoxDestination = await getClinicRedoxDestination(clinic, [
        'media',
        'media-tiff'
    ]);
    if (!redoxDestination) {
        const error = 'No media destination found';
        throw new Error(error);
    }
    return redoxDestination;
}

module.exports = {
    getClinicRedoxDestination,
    getClinicIntegrationSettings,
    getClinicBooleanSetting,
    getClinicById,
    getClinicAndSettings,
    getClinicMediaDestination
};
