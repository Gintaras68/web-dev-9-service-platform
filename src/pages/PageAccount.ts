import { PageTemplate } from '../lib/PageTemplate.js';

export class PageAccount extends PageTemplate {

  constructor() {
    super();
    this.pageTitle = 'Account';
  }

  private heroHTML() {
    return `
          <section>
            <h1 class="main-title">Account</h1>            
          </section>`;
  }

  main() {
    return `<main>
            ${this.heroHTML()}
            <p>Welcom to user account page! </p>
            </main>`;
  }
}

export default PageAccount;
