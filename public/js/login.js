import { isValidEmail, isValidPassword } from './isValid.js';

const formDOM = document.querySelector('.form-login');

if (formDOM) {
  console.log('We have login form!');
  const submitDOM = formDOM.querySelector('button');
  const emailDOM = document.getElementById('email');
  const passDOM = document.getElementById('pswd');
  const emailErrDOM = document.getElementById('emailError');
  const passErrDOM = document.getElementById('pswdError');

  formDOM.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitDOM.disabled = true;
    console.log('pressed ..');

    // validate data (three functions)
    const [eErr, eMsg] = isValidEmail(emailDOM.value);
    const [pErr, pMsg] = isValidPassword(passDOM.value);
    let annyError = eErr || pErr;

    emailErrDOM.innerHTML = eMsg;
    passErrDOM.innerHTML = pMsg;

    if (annyError) {
      // yra klaidu - taisysime
      submitDOM.disabled = false;
    } else {
      // nera klaidu - galima formuoti objekta ir isusti i serveri uzklausa
      console.log(`Send ${formDOM.method} message to ${formDOM.action}`);

      const response = await fetch(formDOM.action, {
        method: formDOM.method,
        body: JSON.stringify({
          email: emailDOM.value,
          pass: passDOM.value,
        }),
      });
      console.log('Waiting ...');

      const responseData = await response.json();
      console.log(responseData);

      submitDOM.disabled = false;
    }
  });
}
