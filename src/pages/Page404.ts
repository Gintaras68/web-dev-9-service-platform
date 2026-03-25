export class Page404 {
  head() {
    return `<head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>- 404 -</title>
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
                  <h1>404</h1>
                  <h3>Ops... page not found</h3>
                </main>
                ${this.footer()}
                <script type="module" src="./js/main.js"></script>
              </body>
            </html>
            `;
  }
}
export default Page404;
