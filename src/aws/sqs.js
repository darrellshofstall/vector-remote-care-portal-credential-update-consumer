const AWS = require('./init');
const sqs = new AWS.SQS();
module.exports.sendMessage = async (
    messageBody,
    queueUrl,
    DelaySeconds = 10
) => {
    const params = {
        DelaySeconds,
        MessageBody: JSON.stringify(messageBody),
        QueueUrl: queueUrl
    };
    return sqs.sendMessage(params).promise();
};
