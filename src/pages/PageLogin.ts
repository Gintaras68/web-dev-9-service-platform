import PageTemplate from '../lib/PageTemplate.js';

export class PageLogin extends PageTemplate {
  constructor() {
    super();
    this.pageTitle = 'Login';
    this.pageStyle = 'register';
  }

  hero() {
    return `<section class="hero">
              <h1>Login</h1>
            </section>`;
  }

  main() {
    return `<main>
               ${this.hero()}
              <section class="section-form">
                <form action="/api/login" method="post" class="form-login">
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

                  <button class="btn" type="submit">Register now!</button>
                </form>
              </section>
            </main>`;
  }
}
export default PageLogin;
