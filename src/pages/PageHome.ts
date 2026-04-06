import { PageTemplate } from '../lib/PageTemplate.js';

export class PageHome extends PageTemplate {
  hero() {
    return `<section class="hero">
              <h1>Main page</h1>
            </section>`;
  }

  main() {
    return `<main>
               ${this.hero()}
              <h2>Yes, it's a landing page ...</h2>
            </main>`;
  }
}

export default PageHome;
