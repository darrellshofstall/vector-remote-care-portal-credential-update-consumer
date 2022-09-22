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
describe('coversheetDatesMatch', () => {
    describe('coversheet dates match and are not null', () => {
        test('should return true', () => {
            const report = {
                coversheetUpdatedAt: '01-01-2022',
                coversheetLastRequestedAt: '01-01-2022'
            };
            const res = utils.coversheetDatesMatch(report);
            expect(res).toBe(true);
        });
    });
    describe('coversheet dates do not match', () => {
        test('should return false', () => {
            const report = {
                coversheetUpdatedAt: '01-01-2022',
                coversheetLastRequestedAt: '01-02-2022'
            };
            const res = utils.coversheetDatesMatch(report);
            expect(res).toBe(false);
        });
    });
    describe('coversheet dates are null', () => {
        test('should return false', () => {
            const report = {
                coversheetUpdatedAt: null,
                coversheetLastRequestedAt: null
            };
            const res = utils.coversheetDatesMatch(report);
            expect(res).toBe(false);
        });
    });
});
