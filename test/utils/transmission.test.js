const { checkTransmissionAndStatus } = require('../../src/utils/transmission');
const transmissionGetters = require('../../src/database/read/redoxTransmission');
const getReportTransmissionSpy = jest.spyOn(
    transmissionGetters,
    'getReportTransmission'
);
describe('transmission utils', () => {
    describe('status does not pass the check', () => {
        beforeEach(() => {
            getReportTransmissionSpy.mockImplementationOnce(() => {
                return {
                    status: 'queued'
                };
            });
        });
        test('throws an error', async () => {
            try {
                await checkTransmissionAndStatus(1, { id: 1 });
            } catch (error) {
                expect(error.message).toBe(
                    'Transmission is either queued or already sent for this report and destination'
                );
            }
        });
    });
    describe('status passes the check', () => {
        beforeEach(() => {
            getReportTransmissionSpy.mockImplementationOnce(() => {
                return {};
            });
        });
        test('does not throw an error', async () => {
            await checkTransmissionAndStatus(1, { id: 1 });
            expect(getReportTransmissionSpy).toBeCalledWith(1, 1);
        });
    });
});
