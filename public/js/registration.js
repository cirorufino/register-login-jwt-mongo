const form = document.querySelector('#reg-form');
form.addEventListener('submit', registerUser);

async function registerUser(event) {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const result = await fetch('/register', {
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
        alert('success');
    } else {
        alert(result.error);
    }
}