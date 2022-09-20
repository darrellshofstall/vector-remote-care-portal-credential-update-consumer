const cdk = require('aws-cdk-lib');
const { DeploymentStack } = require('../cdk/stack');

const app = new cdk.App();

new DeploymentStack(app, 'VectorBaseNodeCDK');
