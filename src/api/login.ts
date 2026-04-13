import { file } from '../lib/file.js';
import { APIresponse, DataForHandlers } from '../lib/server.js';

export async function loginAPI(data: DataForHandlers): Promise<APIresponse> {
  const availableHttpMethods = ['post'];

  if (availableHttpMethods.includes(data.httpMethod)) {
    return await api[data.httpMethod]!(data);
  }

  return {
    statusCode: 405,
    headers: {},
    body: `HTTP method "${data.httpMethod}" is not allowed.`,
  };
}

const api: Record<string, Function> = {};

api.post = async (data: DataForHandlers): Promise<APIresponse> => {
  const { payload } = data;

  console.log(`api.post - payload: `, payload);

  if (typeof payload.email !== 'string' || payload.email === '') {
    console.log('Netinkamas emailas');
    return {
      statusCode: 422,
      headers: {},
      body: 'Email has to be non-empty text',
    };
  }
  if (typeof payload.password !== 'string' || payload.password === '') {
    console.log('Netinkamas slaptazodis');
    return {
      statusCode: 422,
      headers: {},
      body: 'Password has to be non-empty text',
    };
  }

  const keys = Object.keys(payload); // gauname masyvą su objekto raktais
  if (keys.length > 2) {
    return {
      statusCode: 422,
      headers: {},
      body: 'Object must have two keys',
    };
  }

  const [userErr, userMsg] = await file.read('users', payload.email + '.json');
  if (userErr) {
    return {
      statusCode: 409,
      headers: {},
      body: 'Wrong email or/and password.',
    };
  }

  const userObj = JSON.parse(userMsg);

  if (userObj.password !== payload.password) {
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
    email: payload.email,
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
