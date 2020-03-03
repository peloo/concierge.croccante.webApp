'use strict';
const signup = require('./signup/index');
const signin = require('./signin/index');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    console.log('Message captured', event);

    if (!event.action) {
        console.log('Action missing on request message');
        return {
            statusCode: 400,
            body: 'Action is required on your message',
        };
    }

    switch (event.action) {
        case 'signup':
            try {
                if (!await signup.signup(event.account)) {
                    return {
                        statusCode: 401,
                        body: 'Account already registered',
                    };
                } else {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(event),
                    };
                }
            } catch (errorMessage) {
                console.log(errorMessage);
            }
            break;
        case 'signin':
            try {
                const account = await signin.signin(event.account);
                if (account && account.Count === 1) {
                    console.log('Generating the token');
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: account
                    }, 'secret');
                    console.log('Token is', token);

                    console.log('Account can login');
                    return {
                        statusCode: 200,
                        body: {
                            signin: true,
                            token: token
                        },
                    };
                } else {
                    console.log('Account rejected');
                    return {
                        statusCode: 401,
                        body: JSON.stringify({
                            signin: false
                        }),
                    };
                }
            } catch (errorMessage) {
                console.log(errorMessage);
            }
            break;
    }

    return {
        statusCode: 500,
        body: 'Internal Server Error. Check console log on CloudWatch',
    };
};
