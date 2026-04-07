import { PageTemplate } from '../lib/PageTemplate.js';

export class PageHome extends PageTemplate {
    constructor() {
    super();
    this.pageStyle = '/components/services';
  }

  hero() {
    return `<section class="hero">
              <h1>Welcome</h1>
            </section>`;
  }

  services() {
    return `<section class="container">
              <h2 class="section-title">Services</h2>
              <ul class="services-list">
                <li class="services-item">Service card</li>
                <li class="services-item">Service card</li>
                <li class="services-item">Service card</li>
              </ul>
            </section>`;
  }

  main() {
    return `<main>
               ${this.hero()}
               ${this.services()}
            </main>`;
  }
}

export default PageHome;
