const constructs = require('constructs');
const core = require('aws-cdk-lib');
const sqs = require('aws-cdk-lib/aws-sqs');
const lambda = require('aws-cdk-lib/aws-lambda');
const eventsource = require('aws-cdk-lib/aws-lambda-event-sources');
const ssm = require('aws-cdk-lib/aws-ssm');
const { repositoryName } = require('./repository');
const { setEnvironments } = require('./utils/environments');
const {
    lambda: cdkUtilsLambda,
    sqs: cdkUtilsSQS
} = require('@vector-remote-care/cdk-utils/');
const { VectorCdkLambdaEventErrorHandlerStrategy } = cdkUtilsLambda;
const {
    SUMMARY_FIELDS_UPDATE_STREAM_NAME,
    SQS_QUEUE_URL
} = require('../src/config');

class ReportUpdateConsumerService extends constructs.Construct {
    constructor(scope, id, props) {
        super(scope, id, props);
        const reportUpdateConsumerLambda = new nodeLambda.NodejsFunction(
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
                  SQS_QUEUE_URL: queue.queueUrl,
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