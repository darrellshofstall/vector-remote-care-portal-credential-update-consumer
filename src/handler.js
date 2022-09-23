const {
    VectorEventConsumer,
    VectorEventErrorHandlerSQSRetry
} = require('@vector-remote-care/event-client');
const { TEST_SCHEMA_DIR, SQS_QUEUE_URL } = require('./config');
const { sendReport } = require('./reportChecker');
const SCHEMA_REGISTRY_CONFIG = process.env.TEST
    ? { schemaDirName: TEST_SCHEMA_DIR }
    : {};

module.exports.handler = async event => {
    const consumer = new VectorEventConsumer({
        schemaRegistryConfig: SCHEMA_REGISTRY_CONFIG,
        errorHandler: new VectorEventErrorHandlerSQSRetry({
            sqsQueueUrl: process.env[SQS_QUEUE_URL]
        })
    });
    await consumer.consume(event.Records, sendReport);
};
