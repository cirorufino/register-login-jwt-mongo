const form = document.querySelector('#reg-form');
form.addEventListener('submit', registerUser);
const errors = document.querySelector('.errors');

async function registerUser(event) {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    errors.innerHTML='';

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
        alert('Sign-in success, home page redirect');
        location.assign('/main-menu'); 
    } else {
        if(result.errors){
            for(let j = 0; j<result.errors.length; j++){
                let li = document.createElement("LI");
                let liTxt = document.createTextNode(result.errors[j].msg);
                li.appendChild(liTxt);
                errors.appendChild(li);
            }
        }else{
            let li = document.createElement("LI");
            let liTxt = document.createTextNode(result.error);
            li.appendChild(liTxt);
            errors.appendChild(li);
        }
    }
}