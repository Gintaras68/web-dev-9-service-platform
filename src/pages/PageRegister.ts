export class PageRegister {
  head() {
    return `<head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Register</title>
              <link rel="stylesheet" href="./css/main.css" />
            </head>`;
  }

  header() {
    return `<header>HEADER</header>`;
  }

  footer() {
    return `<footer>FOOTER</footer>`;
  }

  render() {
    return `<!doctype html>
            <html lang="en">
              ${this.head()}
              <body>
                ${this.header()}
                <main>
                  <h1>Page for Registration</h1>
                </main>
                ${this.footer()}
                <script type="module" src="./js/main.js"></script>
              </body>
            </html>
            `;
  }
}
export default PageRegister;
