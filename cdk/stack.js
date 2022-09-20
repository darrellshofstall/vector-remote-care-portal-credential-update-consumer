const cdk = require('aws-cdk-lib');

class DeploymentStack extends cdk.Stack {
    /**
     *
     * @param {cdk.Construct} scope
     * @param {string} id
     * @param {cdk.StackProps=} props
     */
    constructor(scope, id, props) {
        super(scope, id, props);

        // ADD CDK RESOURCES
    }
}

module.exports = { DeploymentStack };
