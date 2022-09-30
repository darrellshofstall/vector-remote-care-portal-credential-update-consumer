const {
    VectorEventConsumer,
    VectorEventErrorHandlerSQSRetry
} = require('@vector-remote-care/event-client');
const { sendReport } = require('./reportChecker');


module.exports.handler = async event => {
    const consumer = new VectorEventConsumer({
        errorHandler: new VectorEventErrorHandlerSQSRetry({
            sqsQueueUrl: process.env.SQS_QUEUE_URL
        })
    });
    await consumer.consume(event.Records, sendReport);
};
