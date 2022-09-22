const cdk = require('aws-cdk-lib');
const sm = require('aws-cdk-lib/aws-secretsmanager');

const setEnvironments = stack => {
    const environments = {};
    const secret = sm.Secret.fromSecretAttributes(stack, 'DbSecret', {
        secretArn: `arn:aws:secretsmanager:${cdk.Stack.of(stack).region}:${
            cdk.Stack.of(stack).account
        }:secret:db-password`
    });
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

    return environments;
};

module.exports = { setEnvironments };
