const util = require('../../src/utils/index');
const clinicGetters = require('../../src/database/read/clinic');
const getClinicRedoxDestinationSpy = jest.spyOn(
    clinicGetters,
    'getClinicRedoxDestination'
);
getClinicRedoxDestinationSpy.mockImplementation(() => {
    return [
        {
            id: 1,
            RedoxModelType: {
                id: 1,
                name: 'media'
            }
        }
    ];
});
describe('buildSqsMessageBody', () => {
    describe('with a redox destination clinic and reportid', () => {
        test('buildSqsMessageBody returns correct object', async () => {
            const expectedBody = {
                path: '/send-media-transmission',
                httpMethod: 'POST',
                queryStringParameters: {
                    reportId: 1,
                    clinicRedoxDestinationId: 1,
                    clinicRedoxSearchDestinationId: 1
                }
            };
            const clinic = {
                id: 1
            };
            const redoxDestination = {
                id: 1,
                RedoxModelType: {
                    name: 'media'
                }
            };
            const body = await util.buildSqsMessageBody(
                1,
                clinic,
                redoxDestination
            );
            expect(body).toEqual(expectedBody);
        });
    });
    describe('witout a redox destination', () => {
        test('buildSqsMessageBody throws an error', async () => {
            const clinic = {
                id: 1
            };
            try {
                await util.buildSqsMessageBody(1, clinic, null);
            } catch (error) {
                expect(error.message).toEqual('No Redox destination provided');
            }
        });
    });
});
