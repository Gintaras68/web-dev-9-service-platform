import { isValidEmail, isValidPassword, isValidUsername } from './isValid.js';

const formDOM = document.querySelector('.form');
if (formDOM) {
  console.log('We have registration form!');
  const submitDOM = formDOM.querySelector('button');
  const usernameDOM = document.getElementById('name');
  const emailDOM = document.getElementById('email');
  const passDOM = document.getElementById('pswd');
  const pass2DOM = document.getElementById('pswd2');
  const usernameErrDOM = document.getElementById('nameError');
  const emailErrDOM = document.getElementById('emailError');
  const passErrDOM = document.getElementById('pswdError');
  const pass2ErrDOM = document.getElementById('pswd2Error');

  formDOM.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitDOM.disabled = true;
    console.log('pressed ..');

    // validate data (three functions)
    const [uErr, uMsg] = isValidUsername(usernameDOM.value);
    const [eErr, eMsg] = isValidEmail(emailDOM.value);
    const [pErr, pMsg] = isValidPassword(passDOM.value);
    let annyError = uErr || eErr || pErr;

    usernameErrDOM.innerHTML = uMsg;
    emailErrDOM.innerHTML = eMsg;
    passErrDOM.innerHTML = pMsg;

    if (!pErr && passDOM.value !== pass2DOM.value) {
      pass2ErrDOM.innerHTML = "Passwords doesn't match.";
      annyError = true;
    } else {
      pass2ErrDOM.innerHTML = '<br>';
    }

    if (annyError) {
      // yra klaidu - taisysime
      submitDOM.disabled = false;
    } else {
      // nera klaidu - galima formuoti objekta ir isusti i serveri uzklausa
      const response = await fetch(formDOM.action, {
        method: formDOM.method,
        body: JSON.stringify({
          // method: 'DELETE',
          username: usernameDOM.value,
          email: emailDOM.value,
          password: passDOM.value,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);

      submitDOM.disabled = false;
    }
  });
}
