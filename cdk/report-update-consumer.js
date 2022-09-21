const constructs = require('constructs');
const lambda = require('aws-cdk-lib/aws-lambda');
const ssm = require('aws-cdk-lib/aws-ssm');
const sqs = require('aws-cdk-lib/aws-sqs');
const cdk = require('aws-cdk-lib');
const { repositoryName } = require('./repository');
const { setEnvironments } = require('./utils/environments');
const { lambda: cdkUtilsLambda } = require('@vector-remote-care/cdk-utils/');
const {
    VectorCdkLambdaEventErrorHandlerStrategy,
    VectorCdkLambdaEvent
} = cdkUtilsLambda;
const {
    SUMMARY_FIELDS_UPDATE_STREAM_NAME,
    SQS_QUEUE_URL
} = require('../src/config');

class ReportUpdateConsumerService extends constructs.Construct {
    constructor(scope, id, props) {
        super(scope, id, props);
        const redoxQueue = sqs.Queue.fromQueueArn(
            this,
            'RedoxIntegration',
            `arn:aws:sqs:${cdk.Stack.of(this).region}:${
                cdk.Stack.of(this).account
            }:RedoxIntegration`
        );
        const reportUpdateConsumerLambda = new VectorCdkLambdaEvent(
            scope,
            'reportUpdateConsumer',
            {
                description: 'Lambda function for report updates',
                runtime: lambda.Runtime.NODEJS_14_X,
                entry: './src/handler.js',
                handler: 'server',
                memorySize: ssm.StringParameter.valueForStringParameter(
                    this,
                    `/${repositoryName}/config/lambda-memory`
                ),
                bundling: {
                    nodeModules: ['vector-sequelize-model'],
                    externalModules: [
                        'aws-sdk',
                        'pg-hstore',
                        'vector-sequelize-model'
                    ],
                    commandHooks: {
                        beforeBundling() {},
                        beforeInstall() {},
                        afterBundling() {}
                    }
                },
                environment: {
                    CDK_APP: 'true',
                    SQS_REDOX_QUEUE_URL: redoxQueue.queueUrl,
                    // set ARN of the redox queue
                    ...setEnvironments(scope)
                },
                vpc: props.vpc,
                allowAllOutbound: true
            }
        );

        reportUpdateConsumerLambda.makeEventConsumer({
            consumerGroup: 'coversheet-consumer-group',
            topic: SUMMARY_FIELDS_UPDATE_STREAM_NAME,
            errorHandler: {
                envVars: {
                    envVarSqsQueueUrl: SQS_QUEUE_URL
                },
                strategy: VectorCdkLambdaEventErrorHandlerStrategy.SQS_RETRY
            }
        });

        cdkUtilsLambda.addLambdaMetrics(
            this,
            reportUpdateConsumerLambda,
            'reportUpdateConsumerLambda'
        );
    }
}

module.exports = { ReportUpdateConsumerService };
