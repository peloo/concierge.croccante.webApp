const aws = require('aws-sdk');
const md5 = require('md5');
let client;

async function signin(account) {
    aws.config.update({
        region: 'eu-west-1',
        endpoint: 'https://dynamodb.eu-west-1.amazonaws.com'
    });
    client = new aws.DynamoDB.DocumentClient();

    console.log('Checking account access');
    console.log('Coding password');
    account.Password = await md5(account.Password);

    const params = {
        TableName: "AccountConcierge",
        FilterExpression: "Email = :emailValue and Password = :passwordValue",
        ExpressionAttributeValues: {
            ":emailValue": account.Email,
            ":passwordValue": account.Password
        }
    };

    return new Promise((resolve, reject) => {
        client.scan(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

module.exports.signin = signin;