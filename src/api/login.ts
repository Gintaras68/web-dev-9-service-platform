import { file } from '../lib/file.js';
import { APIresponse } from '../lib/server.js';

export async function loginAPI(
  httpMethod: string,
  restUrlParts: string[],
  jsonData: any,
): Promise<APIresponse> {
  const availableHttpMethods = ['post'];

  if (availableHttpMethods.includes(httpMethod)) {
    return await api[httpMethod]!(restUrlParts, jsonData);
  }

  return {
    statusCode: 405,
    headers: {},
    body: `HTTP method "${httpMethod}" is not allowed.`,
  };
}

const api: Record<string, Function> = {};

api.post = async (
  restUrlParts: string,
  jsonData: any,
): Promise<APIresponse> => {
  console.log(`api.post - jsonData: `, jsonData);

  if (typeof jsonData.email !== 'string' || jsonData.email === '') {
    console.log('Netinkamas emailas');
    return {
      statusCode: 422,
      headers: {},
      body: 'Email has to be non-empty text',
    };
  }
  if (typeof jsonData.password !== 'string' || jsonData.password === '') {
    console.log('Netinkamas slaptazodis');
    return {
      statusCode: 422,
      headers: {},
      body: 'Password has to be non-empty text',
    };
  }

  const keys = Object.keys(jsonData); // gauname masyvą su objekto raktais
  if (keys.length > 2) {
    return {
      statusCode: 422,
      headers: {},
      body: 'Object must have two keys',
    };
  }

  const [userErr, userMsg] = await file.read('users', jsonData.email + '.json');
  if (userErr) {
    return {
      statusCode: 409,
      headers: {},
      body: 'Wrong email or/and password.',
    };
  }

  const userObj = JSON.parse(userMsg);

  if (userObj.password !== jsonData.password) {
    return {
      statusCode: 409,
      headers: {},
      body: 'Wrong email or/and password.',
    };
  }

  const abc = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789';
  let token = '';
  for (let i = 0; i < 20; i++) {
    const index = Math.floor(Math.random() * abc.length);
    token += abc[index];
  }

  const tokenObj = {
    email: jsonData.email,
    createdAt: new Date().getTime(),
  };

  const [tokenErr, tokenMsg] = await file.create(
    'token',
    token + '.json',
    tokenObj,
  );

  if (tokenErr) {
    return {
      statusCode: 500,
      headers: {},
      body: 'Server problem... Please, try again...',
    };
  }

  const timeToDelete = 20;

  const cookieString = [
    `session-token=${token}`,
    `HttpOnly`,
    `Max-Age=`+timeToDelete,
    `Path=/`,
    // `Secure`,  tik naudojant HTTPS
    `SameSite=Strict`,
  ];

  return {
    statusCode: 202,
    headers: {
      'Set-Cookie': cookieString.join('; '),
    },
    body: 'Login is success: ',
  };
};
