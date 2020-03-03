async function signup() {
    if (await checkValidity()) {
        const firstName = document.getElementById('firstName').value.toLowerCase();
        const lastName = document.getElementById('lastName').value.toLowerCase();
        const email = document.getElementById('email').value.toLowerCase();
        const password = document.getElementById('password').value;
        const notificationChosen = document.getElementById('notification').value.toLowerCase();
        const calendarChosen = document.getElementById('calendar').value.toLowerCase();
        const action = document.getElementById('action').value.toLowerCase();
        const today = new Date();
        const dateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

        if (!firstName || !lastName || !email || !password) {
            alert('É necessario compilare tutti i campi.');
        } else {

            let notification;
            switch (notificationChosen) {
                case 'ses':
                    notification = {
                        Service: "ses",
                        Email: email
                    };
                    break;
                case 'sms':
                    notification = {
                        Service: "sms",
                        Number: "undefined"
                    };
                    break;
                case 'whatsapp':
                    notification = {
                        Service: "whatsapp",
                        Number: "undefined"
                    };
                    break;
                case 'telegram':
                    notification = {
                        Service: "telegram",
                        ChatId: "undefined"
                    };
                    break;
                case 'voip':
                    notification = {
                        Service: "voip",
                        Number: "undefined"
                    };
                    break;
            }

            let calendar;
            switch (calendarChosen) {
                case 'googlecalendar':
                    calendar = {
                        from: "Google Calendar",
                        id: email,
                        credentials: "undefined",
                        token: "undefined"
                    };
                    break;
            }

            const url = 'https://qgb89bpft8.execute-api.eu-west-1.amazonaws.com/v1';
            const data = {
                account: {
                    Email: email,
                    Password: password,
                    Name: firstName,
                    Surname: lastName,
                    AccountType: "user",
                    Notification: {
                        notification
                    },
                    Calendar: {
                        calendar
                    },
                    CreatedAt: dateTime
                },
                action: action
            };
            fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(function (response) {
                /*
                 * The response of the fetch is a
                 * Promise of a Promise. Therefore is
                 * necessary to return the first Promise
                 * with this command:
                 */
                return response.json();
            }).catch(function (error) {
                /*
                 * In case the fetch (api call)
                 * generate an error.
                 */
                console.log(error);
                alert('Non é stato possibile collegarsi al server.');
                window.location.replace('index.html');
            }).then(function (responseBody) {
                if (responseBody.statusCode === 200) {
                    window.location.replace('signup-done.html');
                } else {
                    window.location.replace('signup-fail.html');
                }
            })
        }
    }
}

async function checkValidity() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const notification = document.getElementById('notification');
    const calendar = document.getElementById('calendar');
    let toBeContinue = true;

    if (!firstName.checkValidity()) {
        document.getElementById('checkValidityFirsName').innerText = 'Questo campo é obbligatorio';
        toBeContinue = false;
    }

    if (!lastName.checkValidity()) {
        document.getElementById('checkValidityLastName').innerText = 'Questo campo é obbligatorio';
        toBeContinue = false;
    }

    if (!email.checkValidity()) {
        document.getElementById('checkValidityEmail').innerText = 'Email inserita non valida';
        toBeContinue = false;
    }

    if (!password.checkValidity()) {
        document.getElementById('checkValidityPassword').innerText = 'Questo campo é obbligatorio';
        toBeContinue = false;
    }

    if (!notification.checkValidity()) {
        document.getElementById('checkValidityNotification').innerText = 'Questo campo é obbligatorio';
        toBeContinue = false;
    }

    if (!calendar.checkValidity()) {
        document.getElementById('checkValidityCalendar').innerText = 'Questo campo é obbligatorio';
        toBeContinue = false;
    }

    return new Promise(resolve => {
        resolve(toBeContinue);
    })
}
