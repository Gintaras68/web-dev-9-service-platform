import { file } from "../lib/file.js";

export async function registerAPI(httpMethod: string, restUrlParts: string[], jsonData: any): Promise<string> {
  const availableHttpMethods = ['post'];

  if (!availableHttpMethods.includes(httpMethod)) {
    return `HTTP method "${httpMethod}" is not allowed.`;
  }

  return await api[httpMethod]!(restUrlParts, jsonData);
}

const api:Record<string, Function> = {};  

api.post = async (restUrlParts: string, jsonData: any): Promise<string> => {
  if (typeof jsonData.email !== 'string' || jsonData.email === '') {
    return 'Email has to be non-empty text';
  }
    if (typeof jsonData.username !== 'string' || jsonData.username === '') {
    return 'Username has to be non-empty text';
  }
    if (typeof jsonData.password !== 'string' || jsonData.password === '') {
    return 'Password has to be non-empty text';
  }

  const keys = Object.keys(jsonData);  // gauname masyvą su objekto raktais
  if (keys.length > 3) {
    return 'Object must have three keys';
  }

  const [userErr, userMsg] = await file.create('users', jsonData.email + '.json', jsonData);
  if (userErr) {
    return 'User with this email already exist.';
  } 

  console.log("register API response ... User created.");
  return 'register API response ... User created.';
}