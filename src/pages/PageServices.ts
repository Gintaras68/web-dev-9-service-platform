import { PageTemplate } from '../lib/PageTemplate.js';

export class PageServices extends PageTemplate {

  constructor() {
    super();
    this.pageTitle = 'Services';
  }

  hero() {
    return `<section class="hero">
              <h1>Services</h1>
            </section>`;
  }

  main() {
    return `<main>
               ${this.hero()}
              <h2>cards with services ...</h2>
            </main>`;
  }
}

export default PageServices;
