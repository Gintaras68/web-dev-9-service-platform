import { Connection } from "mysql2/promise";
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
export async function deleteOldTokens(checkInterval: number, dbConnection: Connection) {
  const currentTime = new Date().getTime();
  
  // ============   darbas su duomenų baze ...   =============================
  try {
    const [list, param] = await dbConnection.query(`SELECT * FROM tokens`);
    for (const item of list) {
      const {token, createdAt} = item;
      if (currentTime - createdAt > checkInterval * 60 * 1000) {
        console.log(`Tokeną ${token} metas trinti.`);
        await dbConnection.query(`DELETE FROM tokens WHERE token='${token}'`);
      }
    }    
  } catch (error) {
    console.log("Klaida nuskaitant tokenus ↓");
    console.log(error);      
  }
}



