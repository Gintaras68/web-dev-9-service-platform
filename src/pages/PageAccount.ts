import { PageTemplate } from '../lib/PageTemplate.js';

export class PageAccount extends PageTemplate {

  constructor() {
    super();
    this.pageTitle = 'Account';
  }

  hero() {
    return `<section class="hero">
              <h1>Account</h1>
            </section>`;
  }

  main() {
    return `<main>
              ${this.hero()}
              <p>Welcom to user account page! </p>
            </main>`;
  }
}

export default PageAccount;
