const utils = require('../../src/utils');
describe('isReportSendable', () => {
    describe('when all columns are filled out and all settings are true', () => {
        test('should return true', () => {
            const clinicSettings = {
                isRedoxReportReviewEnabled: true,
                isCoversheetSignatureEnabled: true,
                isRedoxIntegrationEnabled: true
            };
            const report = {
                clinicReviewedAt: '01-01-2022',
                clinicSignedAt: '01-02-2022'
            };
            const value = utils.hasRequiredColumns(report, clinicSettings);
            expect(value).toBe(true);
        });
    });
    describe('when all columns are filled out and no settings are true', () => {
        test('should return true', () => {
            const clinicSettings = {
                isRedoxReportReviewEnabled: false,
                isCoversheetSignatureEnabled: false,
                isRedoxIntegrationEnabled: false
            };
            const report = {
                clinicReviewedAt: '01-01-2022',
                clinicSignedAt: '01-02-2022'
            };
            const value = utils.hasRequiredColumns(report, clinicSettings);
            expect(value).toBe(true);
        });
    });
    describe('when no columns are filled out and all settings are true', () => {
        test('should return true', () => {
            const clinicSettings = {
                isRedoxReportReviewEnabled: true,
                isCoversheetSignatureEnabled: true,
                isRedoxIntegrationEnabled: true
            };
            const report = {
                clinicReviewedAt: null,
                clinicSignedAt: ''
            };
            const value = utils.hasRequiredColumns(report, clinicSettings);
            expect(value).not.toBe(true);
        });
    });
});
