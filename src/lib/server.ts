import http, { IncomingMessage, ServerResponse } from 'node:http';
import { file } from './file.js';
import { StringDecoder } from 'node:string_decoder';
import { PageHome } from '../pages/PageHome.js';
import { Page404 } from '../pages/Page404.js';
import { PageRegister } from '../pages/PageRegister.js';
import { PageLogin } from '../pages/PageLogin.js';
export const serverLogic = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  // nustatomas užklausos tekstas
  const baseURL: string = `http://${req.headers.host}`;
  const parsedURL = new URL(req.url ?? '', baseURL);
  const trimmedPath = parsedURL.pathname
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/\/+/g, '/');

  // failų plėtiniai  ir tipai ...
  const textFileExtensions = ['css', 'js', 'json', 'svg', 'webmanifest'];
  const binaryFileExtensions = ['png', 'jpg', 'jpeg', 'webp', 'ico'];
  const extension = (
    trimmedPath.includes('.') ? trimmedPath.split('.').at(-1) : ''
  ) as string;

  type Mimes = Record<string, string>;
  const MIMES: Mimes = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    txt: 'text/plain',
    svg: 'image/svg+xml',
    xml: 'application/xml',
    ico: 'image/vnd.microsoft.icon',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    woff2: 'font/woff2',
    woff: 'font/woff',
    ttf: 'font/ttf',
    webmanifest: 'application/manifest+json',
  };

  // indentifikuojamas užklausos tipas
  const isTextFile = textFileExtensions.includes(extension);
  const isBinaryFile = binaryFileExtensions.includes(extension);
  const isAPI = trimmedPath.startsWith('api/');
  const isPage = !isTextFile && !isBinaryFile && !isAPI;

  // formuojame atsakymą atsižvelgiant kokia gauta užklausa
  let responseContent: string | Buffer = '';
  let buffer = '';
  const stringDecoder = new StringDecoder('utf-8');

  req.on('data', (data) => {
    buffer += stringDecoder.write(data);
  });

  req.on('end', async () => {
    if (isTextFile) {
      console.log(`Uzklausa: ${trimmedPath} => isTextFile`);
      const [err, msg] = await file.readPublic(trimmedPath);
      if (err) {
        res.statusCode = 404;
        console.log(`Error reading ${trimmedPath} file ...`);
      } else {
        res.writeHead(200, {
          'Content-Type': MIMES[extension],
        });
        responseContent = msg;
      }
    }
    if (isBinaryFile) {
      console.log(`Uzklausa: ${trimmedPath} => isBinaryFile`);
      const [err, msg] = await file.readPublicBinary(trimmedPath);
      if (err) {
        res.statusCode = 404;
        console.log(`Error reading ${trimmedPath} file ...`);
      } else {
        res.writeHead(200, {
          'Content-Type': MIMES[extension],
        });
        responseContent = msg;
      }
    }
    if (isAPI) {
      buffer += stringDecoder.end();
      const jsonData = buffer ? JSON.parse(buffer) : {};

      // create file ...
      const [err, msg] = await file.create(
        'users',
        jsonData.email + '.json',
        jsonData,
      );
      if (err) {
        responseContent = msg.toString();
      } else {
        responseContent = `User created.`;
      }

      if (trimmedPath === 'api/login') {
        console.log('We need to try login', jsonData);
      }

      if (trimmedPath === 'api/register') {
        console.log('We need to register new user \n', jsonData);
      }
    }

    if (isPage) {
      res.writeHead(200, { 'content-type': MIMES.html });

      const PageClass = pages[trimmedPath] ? pages[trimmedPath] : pages['404'];
      responseContent = new PageClass().render();
    }

    res.end(responseContent);
  });
};

export const init = () => {
  console.clear();
  console.log('Server init ...');

  httpServer.listen(4409, () => {
    console.log('\nServer running at http://localhost:4409');
  });
};

export const httpServer = http.createServer(serverLogic);

export const pages: Record<string, any> = {
  '': PageHome,
  register: PageRegister,
  login: PageLogin,
  '404': Page404,
};

export const server = {
  init,
  httpServer,
  pages,
};

export default server;
