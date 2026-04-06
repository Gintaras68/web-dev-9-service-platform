import { file } from "./file.js";

export function cookieParser(string: string): Record<string, string> {
  const cookies = string.split('; ');
  let cookiesObj: Record<string, string> = {};

  for (const str of cookies) {
    if (str) {
      const [key, value] = str.split('=') as [string, string];
      cookiesObj[key] = value;
    }
  }
  return cookiesObj;
}

export async function isUserLoggedIn(tokenString: string | undefined): Promise<boolean> {
  if (typeof tokenString !== 'string') {
    return false;
  }

  const [tokenErr, tokenMsg] = await file.read('token', tokenString + '.json');
  if (tokenErr) {
    return false;
  }

  const {email, createdAt} = JSON.parse(tokenMsg);
  
  if (createdAt + 10000 < new Date().getTime()) {
    return false
  }

  return true;
}
