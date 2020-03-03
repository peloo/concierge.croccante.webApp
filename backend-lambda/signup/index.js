const aws = require('aws-sdk');
const md5 = require('md5');
let client;

async function signup(item) {
    aws.config.update({
        region: 'eu-west-1',
        endpoint: 'https://dynamodb.eu-west-1.amazonaws.com'
    });
    client = new aws.DynamoDB.DocumentClient();

    try {
        const account = await getAccount(item.Email);
        if (account && account.Count === 1) {
            console.log('Account already registered');
            return new Promise(resolve => {
                resolve(false);
            });
        } else {
            console.log('Registering new account');
            console.log('Coding password');

            item.Password = await md5(item.Password);
            const params = {
                TableName: "AccountConcierge",
                Item: item,
                ConditionExpression: "Email <> :emailVal",
                ExpressionAttributeValues: {
                    ":emailVal": item.Email
                }
            };

            return new Promise((resolve, reject) => {
                client.put(params, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                })
            });
        }
    } catch (error) {
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

async function getAccount(email) {
    const params = {
        TableName: "AccountConcierge",
        FilterExpression: "Email = :emailValue",
        ExpressionAttributeValues: {
            ":emailValue": email,
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

module.exports.signup = signup;