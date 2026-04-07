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

/**
 * 
 * @param checkInterval - laikas minutėmis (t. y. dar *60*1000)
 */
export async function deleteOldTokens(checkInterval: number) {
  const dir: string  = 'token';
  const currentTime = new Date().getTime();
  
  const [err, list] = await file.list(dir);
  if (err) {
    console.log("Klaida ieskant katalogo ...");      
  }
  console.log("Kataloge /.data/token/ randasi:\n", list);  

  for (const fileName of list) {
    if (fileName.includes('.json')) {
      // nuskaitome failą ir patikriname jo galiojimą
      const [err, content] = await file.read(dir, fileName)
      const tokenObj = JSON.parse(content as string); 
      
      if (currentTime - tokenObj.createdAt > checkInterval * 60 * 1000) {
        console.log(fileName, " metas trinti ...");        
        await file.delete('token', fileName);      
      }

    }    
  }
}



