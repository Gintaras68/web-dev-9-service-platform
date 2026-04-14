import { file } from '../lib/file.js';
import { APIresponse, DataForHandlers } from '../lib/server.js';

export async function registerAPI(data: DataForHandlers): Promise<APIresponse> {
  const { httpMethod } = data;
  const availableHttpMethods = ['post'];

  if (availableHttpMethods.includes(httpMethod)) {
    return await api[httpMethod]!(data);
  }

  return {
    statusCode: 405,
    headers: {},
    body: `HTTP method "${httpMethod}" is not allowed.`,
  };
} 

const api: Record<string, Function> = {};

api.post = async (data: DataForHandlers): Promise<APIresponse> => {
  const { dbConnection, payload } = data;

  if (typeof payload.email !== 'string' || payload.email === '') {
    return {
      statusCode: 422,
      headers: {},
      body: 'Email has to be non-empty text',
    };
  }
  if (typeof payload.username !== 'string' || payload.username === '') {
    return {
      statusCode: 422,
      headers: {},
      body: 'Username has to be non-empty text',
    };
  }
  if (typeof payload.password !== 'string' || payload.password === '') {
    return {
      statusCode: 422,
      headers: {},
      body: 'Password has to be non-empty text',
    };
  }

  const keys = Object.keys(payload); // gauname masyvą su objekto raktais
  if (keys.length > 3) {
    return {
      statusCode: 422,
      headers: {},
      body: 'Object must have three keys',
    };
  }
  
  try {
    const [thisEmail, par] = await dbConnection.query(`SELECT * FROM users WHERE email= '${payload.email}'`);
    if (thisEmail.length) {
      console.log("Jau yra toks vartotojas");
      return {
        statusCode: 303,
        headers: {},
        body: 'This email address already in use.',
      };  
    }

    const queryString =`INSERT INTO users (username, email, password) 
        VALUES ('${payload.username}', '${payload.email}', '${payload.password}')`;
    await dbConnection.query(queryString);
  } catch (error) {
    console.log(error);    
  }
  
  
  console.log('register API response ... User created.');
  return {
    statusCode: 201,
    headers: {},
    body: 'User created.',
  };
};

 