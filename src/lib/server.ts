import http, { IncomingMessage, ServerResponse } from 'node:http';
import { file } from './file.js';
import { StringDecoder } from 'node:string_decoder';
import { PageHome } from '../pages/PageHome.js';
import { PageServices } from '../pages/PageServices.js';
import { Page404 } from '../pages/Page404.js';
import { PageRegister } from '../pages/PageRegister.js';
import { PageLogin } from '../pages/PageLogin.js';
import { PageAccount  } from '../pages/PageAccount.js';
import { registerAPI } from '../api/register.js';
import { loginAPI } from '../api/login.js';


export const serverLogic = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  // nustatomas užklausos tekstas
  const baseURL: string = `http://${req.headers.host}`;
  const parsedURL = new URL(req.url ?? '', baseURL);
  const httpMethod = req.method?.toLowerCase() ?? 'get';
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

      res.writeHead(200, {
        'content-type': MIMES.json,
        'set-cookie': ''
      });

      let jsonData =  {};
      try {
        jsonData = JSON.parse(buffer);
        
      } catch (error) { 
        console.log("Failed parsing JSON");
        
      }

      const [, endpoint, ...restUrlParts] = trimmedPath.split('/') as [string, string, string[]];
      const apiFunction = apiEndpoints[endpoint];
      
      if (apiFunction) {
        console.log("Call a function\n------------");        
        responseContent = await apiFunction(httpMethod, restUrlParts, jsonData);        
      } else {
        console.log("Return info ...");
        responseContent = "TOKS API ENDPOINTAS NEEGZISTUOJA !";
      }

      responseContent = JSON.stringify(responseContent);
    }

    if (isPage) {
      res.writeHead(200, { 'content-type': MIMES.html });

      const PageClass = publicPages[trimmedPath] ? publicPages[trimmedPath] : publicPages['404'];
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

export const publicPages: Record<string, any> = {
  '': PageHome,
  'services': PageServices,
  'register': PageRegister,
  'login': PageLogin,
  '404': Page404,
};

export const protectedPages: Record<string, any> = {
  'account': PageAccount,
};

export const apiEndpoints: Record<string, any> = {
  'register': registerAPI,
  'login': loginAPI,
};

export const server = {
  init,
  httpServer,
  publicPages,
  protectedPages,
};

export default server;