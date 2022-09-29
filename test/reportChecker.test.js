const reportChecker = require('../src/reportChecker');
const clinicGetters = require('../src/database/read/clinic');
const redoxTransmissionCreate = require('../src/database/create/redoxTransmission');
const utils = require('../src/utils/index');
const reportUtils = require('../src/utils/report');
const transmissionUtils = require('../src/utils/transmission');
const reportGetters = require('../src/database/read/report');
const getClinicAndSettingsSpy = jest.spyOn(
    clinicGetters,
    'getClinicAndSettings'
);
const getClinicMediaDestinationSpy = jest.spyOn(
    clinicGetters,
    'getClinicMediaDestination'
);
const getReportByIdSpy = jest.spyOn(reportGetters, 'getReportById');
const isReportReadyToSendSpy = jest.spyOn(reportUtils, 'isReportReadyToSend');
const checkTransmissionAndStatusSpy = jest.spyOn(
    transmissionUtils,
    'checkTransmissionAndStatus'
);
const buidAndSendSqsMessageSpy = jest.spyOn(utils, 'buidAndSendSqsMessage');
const createQueuedTransmissionSpy = jest.spyOn(
    redoxTransmissionCreate,
    'createQueuedTransmission'
);

describe('testing', () => {
    const clinicSettings = {
        isRedoxReportReviewEnabled: true,
        isCoversheetSignatureEnabled: true,
        isRedoxIntegrationEnabled: true
    };
    const report = {
        id: 1,
        Device: {
            PortalPatient: {
                Patient: {
                    id: 1
                }
            }
        }
    };
    const clinic = {
        id: 1
    };
    const redoxDestination = {
        id: 1
    };
    beforeEach(() => {
        getClinicAndSettingsSpy.mockImplementation(() => ({
            clinic,
            clinicSettings
        }));
        getReportByIdSpy.mockImplementation(() => report);
        getClinicMediaDestinationSpy.mockImplementation(() => redoxDestination);
        isReportReadyToSendSpy.mockImplementation(() => false);
        checkTransmissionAndStatusSpy.mockImplementation(jest.fn);
        buidAndSendSqsMessageSpy.mockImplementation(jest.fn);
        createQueuedTransmissionSpy.mockImplementation(jest.fn);
    });
    describe('Report is not ready to send', () => {
        test('should call get clinic and get report but nothing else', async () => {
            try {
                await reportChecker.sendReport({ reportId: 1, clinicId: 1 });
                expect(getClinicAndSettingsSpy).toBeCalledWith(1);
                expect(getReportByIdSpy).toBeCalledWith(1);
                expect(isReportReadyToSendSpy).toBeCalledWith(
                    report,
                    clinicSettings
                );
                expect(getClinicMediaDestinationSpy).not.toHaveBeenCalled();
                expect(checkTransmissionAndStatusSpy).not.toHaveBeenCalled();
                expect(buidAndSendSqsMessageSpy).not.toHaveBeenCalled();
                expect(createQueuedTransmissionSpy).not.toHaveBeenCalled();
            } catch (error) {
                expect(error.message).toEqual(null);
            }
        });
    });
    describe('Report is ready to send', () => {
        beforeEach(() => {
            isReportReadyToSendSpy.mockImplementation(() => true);
        });
        test('should call all functions with correct params', async () => {
            await reportChecker.sendReport({ reportId: 1, clinicId: 1 });
            expect(getClinicAndSettingsSpy).toBeCalledWith(1);
            expect(getReportByIdSpy).toBeCalledWith(1);
            expect(isReportReadyToSendSpy).toBeCalledWith(
                report,
                clinicSettings
            );
            expect(getClinicMediaDestinationSpy).toBeCalledWith(clinic);
            expect(checkTransmissionAndStatusSpy).toBeCalledWith(
                report.id,
                redoxDestination.id
            );
            expect(buidAndSendSqsMessageSpy).toBeCalledWith(
                report.id,
                clinic,
                redoxDestination
            );
            expect(createQueuedTransmissionSpy).toBeCalledWith(
                report.id,
                redoxDestination.id,
                report.Device.PortalPatient.Patient.id
            );
        });
    });
});
