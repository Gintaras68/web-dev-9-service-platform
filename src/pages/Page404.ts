import PageTemplate from '../lib/PageTemplate.js';

export class Page404 extends PageTemplate {
  constructor() {
    super();
    this.pageTitle = 'Error';
  }

  main() {
    return `<main>
              <h1>404</h1>
              <h3>Ops... page not found</h3>
            </main>`;
  }
}
export default Page404;
