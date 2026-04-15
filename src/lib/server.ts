import http, { IncomingMessage, ServerResponse } from 'node:http';
import { StringDecoder } from 'node:string_decoder';
import { Connection } from 'mysql2/promise';
import { file } from './file.js';
import { cookieParser, isUserLoggedIn } from './utils.js';
// PAGES
import { PageHome } from '../pages/PageHome.js';
import { PageServices } from '../pages/PageServices.js';
import { Page404 } from '../pages/Page404.js';
import { PageRegister } from '../pages/PageRegister.js';
import { PageLogin } from '../pages/PageLogin.js';
import { PageAccount  } from '../pages/PageAccount.js';
//API
import { registerAPI } from '../api/register.js';
import { loginAPI } from '../api/login.js';
import { servicesAPI } from '../api/services.js';

let dbConnection = {} as Connection;

export type APIresponse = {
  statusCode: number;
  headers: Record<string, any>;
  body: string | undefined;
};

export type DataForHandlers = {
  dbConnection: Connection,
  httpMethod: string,
  trimmedPath: string,
  payload: any,
  user: {
    email: string,
    isLoggedIn: boolean,
  },
}

export const serverLogic = async ( req: IncomingMessage, res: ServerResponse ) => {
  // nustatomas užklausos tekstas (URL)
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
  let responseContent: string | Buffer | undefined = '';
  let responseStatusCode = 200;
  let buffer = '';
  const stringDecoder = new StringDecoder('utf-8');

  req.on('data', (data) => {
    buffer += stringDecoder.write(data);
  });

  req.on('end', async () => {
    buffer += stringDecoder.end();
    let jsonData =  {};
    try {
      jsonData = JSON.parse(buffer);        
    } catch (error) { 
      // console.log("Failed parsing JSON");        
    }

    const dataForHandlers: DataForHandlers = {
      dbConnection,
      httpMethod,
      trimmedPath,
      payload: jsonData,
      user: {
        email: '',
        isLoggedIn: false,
      },
    }
    
    
    if (isTextFile) {
      const [err, msg] = await file.readPublic(trimmedPath);
      if (err) {
        res.statusCode = 404;
      } else {
        res.writeHead(responseStatusCode, {
          'Content-Type': MIMES[extension],
        });
        responseContent = msg;
      }
    }

    if (isBinaryFile) {
      const [err, msg] = await file.readPublicBinary(trimmedPath);
      if (err) {
        res.statusCode = 404;
      } else {
        res.writeHead(responseStatusCode, {
          'Content-Type': MIMES[extension],
        });
        responseContent = msg;
      }
    }

    if (isAPI) {
      const baseHeaders = { 'Content-Type': MIMES.json, };
      let apiRes = {} as APIresponse;
      
      const [, endpoint, ...restUrlParts] = trimmedPath.split('/') as [string, string, string[]];
      const apiFunction = apiEndpoints[endpoint];
      
      if (apiFunction) {
        console.log("Call a function\n------------");        
        apiRes = await apiFunction(dataForHandlers) as APIresponse;        
      } else {
        apiRes = {
          statusCode: 200,
          headers: {},
          body: "TOKS API ENDPOINTAS NEEGZISTUOJA !"
        }
      }

      
      res.writeHead(apiRes.statusCode, {
        ...baseHeaders,
        ...apiRes.headers
      });

      responseContent = JSON.stringify(apiRes.body);
    }

    if (isPage) {
      res.writeHead(responseStatusCode, { 'content-type': MIMES.html });

      const cookiesObj: Record<string, string> = cookieParser(req.headers.cookie ?? '');
      const isLoggedIn = await isUserLoggedIn(cookiesObj['session-token'], dbConnection);

      if (isLoggedIn) {
        console.log("Tokenas 'session-token': ", cookiesObj['session-token'], ">> vatotojas prisijungęs");
      } else {
        console.log("Tokenas 'session-token': ", cookiesObj['session-token'], ">> vatotojas nėra prisijungęs.");
      }

      let PageClass = publicPages['404'];

      if (isLoggedIn && trimmedPath in protectedPages) {
        PageClass = protectedPages[trimmedPath];
      }

      if (trimmedPath in publicPages) {
        PageClass = publicPages[trimmedPath];
      }

      responseContent = new PageClass().render();
    }

    res.end(responseContent);
  });
};

export const init = (dbConnectionObj: Connection) => {
  dbConnection = dbConnectionObj

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
  'services': servicesAPI,
  'login': loginAPI,
};

export const server = {
  init,
  httpServer,
  publicPages,
  protectedPages,
};

export default server;