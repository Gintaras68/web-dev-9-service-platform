import { PageTemplate } from '../lib/PageTemplate.js';

export class PageHome extends PageTemplate {
  main() {
    return `<main>
              <h1>This is main page</h1>
            </main>`;
  }
}

export default PageHome;
