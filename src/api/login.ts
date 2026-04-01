import { file } from '../lib/file.js';

export async function loginAPI(
  httpMethod: string,
  restUrlParts: string[],
  jsonData: any,
): Promise<string> {
  const availableHttpMethods = ['post'];

  if (!availableHttpMethods.includes(httpMethod)) {
    return `HTTP method "${httpMethod}" is not allowed.`;
  }

  return await api[httpMethod]!(restUrlParts, jsonData);
}

const api: Record<string, Function> = {};

api.post = async (restUrlParts: string, jsonData: any): Promise<string> => {
  console.log(`api.post - jsonData: `, jsonData);

  if (typeof jsonData.email !== 'string' || jsonData.email === '') {
    console.log('Netinkamas emailas');
    return 'Email has to be non-empty text';
  }
  if (typeof jsonData.password !== 'string' || jsonData.password === '') {
    console.log('Netinkamas slaptazodis');
    return 'Password has to be non-empty text';
  }

  const keys = Object.keys(jsonData); // gauname masyvą su objekto raktais
  if (keys.length > 2) {
    return 'Object must have two keys';
  }

  const [userErr, userMsg] = await file.read('users', jsonData.email + '.json');
  if (userErr) {
    return 'Wrong email or/and password.';
  }

  const userObj = JSON.parse(userMsg);

  if (userObj.password !== jsonData.password) {
    return 'Wrong email or/and password.';
  }

  const abc = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789';
  let token = '';
  for (let i  = 0; i  < 20; i ++) {
    const index = Math.floor(Math.random() * abc.length);
    token += abc[index];
  }

  // const token = '5fdgdr1gdr8tdg1gd6fg4df5g';
  const tokenObj = { email: jsonData.email, createdAt: new Date().getTime() };
  const [tokenErr, tokenMsg] = await file.create( 'token', token + '.json', tokenObj );

  if (tokenErr) {
    return 'Server problem... Please, try again...';
  }

  return 'Login is success: ' + token;
};
