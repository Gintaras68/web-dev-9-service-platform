import PageTemplate from '../lib/PageTemplate.js';

export class PageLogin extends PageTemplate {
  constructor() {
    super();
    this.pageTitle = 'Login';
    this.pageStyle = 'register';
  }

  main() {
    return `<main>
              <section class="inner-hero">HERRO</section>
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
