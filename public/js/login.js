const form = document.querySelector('#login');
form.addEventListener('submit', login);
const errors = document.querySelector('.errors');

async function login(event) {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    errors.innerHTML='';

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
        location.assign('/main-menu');
    } else {
        let li = document.createElement("LI");
        let liTxt = document.createTextNode(result.error);
        li.appendChild(liTxt);
        errors.appendChild(li);
    }
}