const cdk = require('aws-cdk-lib');
const ssm = require('aws-cdk-lib/aws-ssm');
const { repositoryName } = require('../repository');
const sm = require('aws-cdk-lib/aws-secretsmanager');

let globalEnvironments = new Map();
const setEnvironments = stack => {
    if (globalEnvironments.get(stack)) {
        return globalEnvironments.get(stack);
    }
    const environments = {};
    const secret = sm.Secret.fromSecretAttributes(stack, 'DbSecret', {
        secretArn: `arn:aws:secretsmanager:${cdk.Stack.of(stack).region}:${
            cdk.Stack.of(stack).account
        }:secret:db-password`
    });
    environments.GPR_READ_TOKEN = ssm.StringParameter.valueForStringParameter(
        stack,
        '/code-build/general/GPR_READ_TOKEN'
    );
    environments.GITHUB_ACCESS_TOKEN = ssm.StringParameter.valueForStringParameter(
        stack,
        '/code-build/general/GITHUB_ACCESS_TOKEN'
    );

    environments.DATABASE_HOST = secret
        .secretValueFromJson('host')
        .unsafeUnwrap();
    environments.DATABASE_PASSWORD = secret
        .secretValueFromJson('password')
        .unsafeUnwrap();
    environments.DATABASE_USER = secret
        .secretValueFromJson('username')
        .unsafeUnwrap();
    environments.DATABASE_DB_NAME = 'vectorremote';

    globalEnvironments.set(stack, environments);
    return environments;
};

module.exports = { setEnvironments };