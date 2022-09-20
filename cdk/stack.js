const cdk = require('aws-cdk-lib');
const cdkUtils = require('@vector-remote-care/cdk-utils');
const {
  reportUpdateConsumerService
} = require('./report-update-consumer');
class DeploymentStack extends cdk.Stack {
    /**
     *
     * @param {cdk.Construct} scope
     * @param {string} id
     * @param {cdk.StackProps=} props
     */
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = cdkUtils.vpc.getVPC(this);
        new reportUpdateConsumerService(this, 'reportUpdateConsumerService', {vpc})
        // ADD CDK RESOURCES
    }
}

module.exports = { DeploymentStack };
