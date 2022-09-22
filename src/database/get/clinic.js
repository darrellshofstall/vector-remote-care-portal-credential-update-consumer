const models = require('vector-sequelize-model');
/**
 *
 * @param {number} clinicId
 * @returns {{isRedoxReportReviewEnabled: boolean, isCoversheetSignatureEnabled: boolean, , isRedoxIntegrationEnabled: boolean}}
 */
async function getClinicIntegrationSettings(clinicId) {
    const clinic = await models.Clinic.findByPk(clinicId);
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

async function getClinicBooleanSetting(clinic, settingName) {
    return await clinic.getBooleanSetting(settingName);
}

module.exports = {
    getClinicIntegrationSettings,
    getClinicBooleanSetting
};
