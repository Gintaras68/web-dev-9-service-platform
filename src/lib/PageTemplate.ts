export class PageTemplate {
  private baseTitle: string;
  protected pageTitle: string;
  protected pageStyle: string;

  constructor() {
    this.baseTitle = 'Services platform';
    this.pageTitle = '';
    this.pageStyle = '';
  }

  head() {
    const title =
      this.pageTitle !== ''
        ? `${this.pageTitle} | ${this.baseTitle}`
        : this.baseTitle;

    return `<head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>${title}</title>
              <link rel="stylesheet" href="./css/main.css" />
              ${this.pageStyle ? `<link rel="stylesheet" href="./css/${this.pageStyle}.css" />` : ''}
              
            </head>`;
  }

  header() {
    return `<header class="main-header">
              <a class="logo" href=".">LoGo</a>
              <nav class="header-nav">
                <a href=".">Home</a>
                <a href="services">Services</a>
                <a href="register">Register</a>
                <a href="login">Login</a>
              </nav>
            </header>`;
  }

  hero() {
    return `<section class="hero">
              <h1>section Hero</h1>
            </section>`;
  }

  footer() {
    return `<footer>FOOTER TEMPLATE</footer>`;
  }

  main() {
    return `<main>
              ${this.hero()}
              PAGE TEMPLATE
            </main>`;
  }

  render() {
    return `<!doctype html>
            <html lang="en">
              ${this.head()}
              <body>
                ${this.header()}
                ${this.main()}
                ${this.footer()}
                <script type="module" src="./js/main.js"></script>
              </body>
            </html>
            `;
  }
}

export default PageTemplate;
