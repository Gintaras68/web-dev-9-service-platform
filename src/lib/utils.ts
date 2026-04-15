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

/**
 * Tikrina pagal gautą tokeną - ar toks yra duomenų bazėje
 * @param tokenString token got from user
 * @returns boolean (true if already have token in DB)
 */
export async function isUserLoggedIn(tokenString: string | undefined, dbConnection: Connection): Promise<boolean> {

  if (typeof tokenString !== 'string') {
    console.log("Narsykle be tokeno - toliau neziurime - neprisijungęs");    
    return false;
  }

  // =====  database ...    =====================
  const [list, param] = await dbConnection.query(`SELECT * FROM tokens WHERE token='${tokenString}'`);

  if (list.length === 0) {
    console.log("Duomenų bazėje nėra saugomas toks tokenas!");    
    return false;
  }

  const tokenObj = list[0];

  // ------------------    ↓↓ - minutes - galiojimo laikas
  if (tokenObj.createdAt + 1 * 60000 < new Date().getTime()) {
    console.log("Baigesi tokeno galiojimas duomenu bazeje ...!");    
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



