function loadSignin() {

}

async function signin() {
    if (await checkValidity()) {
        const email = document.getElementById('email').value.toLowerCase();
        const password = document.getElementById('password').value;
        const action = document.getElementById('action').value.toLowerCase();
        const today = new Date();
        const dateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        const data = {
            account: {
                Email: email,
                Password: password,
                SignOn: dateTime
            },
            action: action
        };
        if (!email || !password) {
            alert('É necessario compilare tutti i campi.');
        } else {
            const url = 'https://qgb89bpft8.execute-api.eu-west-1.amazonaws.com/v1';
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
                    sessionStorage.token = responseBody.body.token;
                    window.location.replace('panel/panel.html');
                } else {
                    window.location.replace('signin/signin-fail.html');
                }
            });
        }
    }
}

async function checkValidity() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let toBeContinue = true;

    if (!email.checkValidity()) {
        document.getElementById('checkValidityEmail').innerText = 'Email inserita non valida';
        toBeContinue = false;
    }

    if (!password.checkValidity()) {
        document.getElementById('checkValidityPassword').innerText = 'Password inserita non valida';
        toBeContinue = false;
    }

    return new Promise(resolve => {
        resolve(toBeContinue);
    })
}

