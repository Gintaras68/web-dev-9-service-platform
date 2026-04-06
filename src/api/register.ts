import { file } from '../lib/file.js';
import { APIresponse } from '../lib/server.js';

export async function registerAPI(
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
  if (typeof jsonData.email !== 'string' || jsonData.email === '') {
    return {
      statusCode: 422,
      headers: {},
      body: 'Email has to be non-empty text',
    };
  }
  if (typeof jsonData.username !== 'string' || jsonData.username === '') {
    return {
      statusCode: 422,
      headers: {},
      body: 'Username has to be non-empty text',
    };
  }
  if (typeof jsonData.password !== 'string' || jsonData.password === '') {
    return {
      statusCode: 422,
      headers: {},
      body: 'Password has to be non-empty text',
    };
  }

  const keys = Object.keys(jsonData); // gauname masyvą su objekto raktais
  if (keys.length > 3) {
    return {
      statusCode: 422,
      headers: {},
      body: 'Object must have three keys',
    };
  }

  const [userErr, userMsg] = await file.create( 'users', jsonData.email + '.json', jsonData );
  if (userErr) {
    return {
      statusCode: 409,
      headers: {},
      body: 'User with this email already registered.',
    };
  }

  console.log('register API response ... User created.');
  return {
    statusCode: 201,
    headers: {},
    body: 'User created.',
  };
};
