import http, { IncomingMessage, ServerResponse } from 'node:http';
import { file } from './file.js';
import { StringDecoder } from 'node:string_decoder';

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
      console.log(`Uzklausa: ${trimmedPath} => isAPI`);
      buffer += stringDecoder.end();
      const gotData = buffer ? JSON.parse(buffer) : {};
      console.log(`gotData:`, gotData);
      responseContent = 'API REACTION ...';
    }
    if (isPage) {
      responseContent = 'HTML file ...';
      if (trimmedPath) {
        const [err, msg] = await file.readPublic(trimmedPath + '.html');
        if (err) {
          res.statusCode = 404;
          console.log(`Error reading ${trimmedPath} file ...`);
        } else {
          res.writeHead(200, {
            'Content-Type': MIMES.html,
          });
          responseContent = msg;
        }
      } else {
        const [err, msg] = await file.readPublic('index.html');
        if (err) {
          res.statusCode = 404;
          console.log(`Error reading ${trimmedPath} file ...`);
        } else {
          res.writeHead(200, {
            'Content-Type': MIMES.html,
          });
          responseContent = msg;
        }
      }
    }

    res.end(responseContent);
  });
};

export const httpServer = http.createServer(serverLogic);

export const init = () => {
  console.clear();
  console.log('Server init ...');
  httpServer.listen(4409, () => {
    console.log('\nServer running at http://localhost:4409');
  });
};

export const server = {
  init,
  httpServer,
};

export default server;
