const form = document.querySelector('#login');
form.addEventListener('submit', login);

async function login(event) {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        console.log('Got the token: ', result.data);
        localStorage.setItem('token', result.data);
        alert('Accesso eseguito')
    } else {
        alert(result.error);
    }
}