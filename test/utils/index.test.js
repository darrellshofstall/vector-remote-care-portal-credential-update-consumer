const util = require('../../src/utils/index');
const sqs = require('../../src/aws/sqs');
const clinicGetters = require('../../src/database/read/clinic');
const getClinicRedoxDestinationSpy = jest.spyOn(
    clinicGetters,
    'getClinicRedoxDestination'
);
const sendMessageSpy = jest.spyOn(sqs, 'sendMessage');
sendMessageSpy.mockImplementation(jest.fn);

describe('buildSqsMessageBody', () => {
    describe('with a redox destination clinic and reportid', () => {
        beforeEach(() => {
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
        });
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
    describe('no clinicRedoxSearchDestination found', () => {
        beforeEach(() => {
            getClinicRedoxDestinationSpy.mockImplementation(() => {
                return [];
            });
        });
        test('no clinicRedoxSearchDestinationId in the body', async () => {
            const expectedBody = {
                path: '/send-media-transmission',
                httpMethod: 'POST',
                queryStringParameters: {
                    reportId: 1,
                    clinicRedoxDestinationId: 1,
                    clinicRedoxSearchDestinationId: null
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

describe('getRedoxSqsPath', () => {
    describe('a redox destination is provided', () => {
        test('should return a valid path', () => {
            const redoxDestination = {
                id: 1,
                RedoxModelType: {
                    name: 'media'
                }
            };
            const result = util.getRedoxSqsPath(redoxDestination);
            expect(result).toEqual('/send-media-transmission');
        });
    });

    describe('a redox destination is provided', () => {
        test('should return a valid path', () => {
            try {
                util.getRedoxSqsPath(null);
            } catch (error) {
                expect(error.message).toEqual('No Redox destination provided');
            }
        });
    });
});

describe('buidAndSendSqsMessage', () => {
    beforeEach(() => {
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
    });
    describe('when passed required params', () => {
        test('should call send function with the correct params', async () => {
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

            await util.buidAndSendSqsMessage(1, clinic, redoxDestination);
            expect(sendMessageSpy).toBeCalledWith(expectedBody, undefined, 300);
        });
    });
    describe('when not passed required params', () => {
        beforeEach(() => {
            getClinicRedoxDestinationSpy.mockImplementation(() => {
                return [];
            });
        });
        test('should throw an error', async () => {
            try {
                await util.buidAndSendSqsMessage(null, null, null);
            } catch (error) {
                expect(error.message).toEqual('No Redox destination provided');
            }
        });
    });
});
