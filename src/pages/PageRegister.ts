import PageTemplate from '../lib/PageTemplate.js';

export class PageRegister extends PageTemplate {
  constructor() {
    super();
    this.pageTitle = 'Register';
    this.pageStyle = 'register';
  }

  hero() {
    return `<section class="hero">
              <h1>Register</h1>
            </section>`;
  }

  main() {
    return `<main>
               ${this.hero()}
              <section class="section-form">
                <form action="/api/register" method="post" class="form">
                  <div class="form-row" data-state>
                    <label for="name">Username</label>
                    <input type="text" name="name" id="name" placeholder="Letters only between 4...20 symbols" required />
                    <p id="nameError"><br></p>
                  </div>

                  <div class="form-row" data-state>
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="Example: username@mail.com" required />
                    <p id="emailError"><br></p>
                  </div>

                  <div class="form-row" data-state>
                    <label for="pswd">Password</label>
                    <input type="password" name="pswd" id="pswd" placeholder="Between 12...30 symbols" required />
                    <p id="pswdError"><br></p>
                  </div>

                  <div class="form-row" data-state>
                    <label for="pswd2">Repeat password</label>
                    <input type="password" name="pswd2" id="pswd2" placeholder="Repeat the password" />
                    <p id="pswd2Error"><br></p>
                  </div>

                  <button class="btn" type="submit">Register now!</button>
                </form>
              </section>
            </main>`;
  }
}
export default PageRegister;
