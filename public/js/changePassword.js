const form = document.querySelector('#reg-form');
form.addEventListener('submit', newPassword);
const errors = document.querySelector('.errors');

async function newPassword(event) {
    event.preventDefault();
    const password = document.querySelector('#password').value;
    errors.innerHTML = '';

    const result = await fetch('/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newPassword: password
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        alert('Password changed');
        location.assign('/main-menu');
    } else {
        let li = document.createElement("LI");
        let liTxt = document.createTextNode(result.error[0].msg);
        li.appendChild(liTxt);
        errors.appendChild(li);
    }
}