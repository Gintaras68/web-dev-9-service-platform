import { PageTemplate } from '../lib/PageTemplate.js';

export class PageServices extends PageTemplate {

  constructor() {
    super();
    this.pageTitle = 'Services';
  }

  main() {
    return `<main>
              <h1>This is Services page</h1>
            </main>`;
  }
}

export default PageServices;
