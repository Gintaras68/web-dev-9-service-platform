import { Connection } from "mysql2/promise";

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
  const queryString = `SELECT * FROM tokens WHERE token='${tokenString}'`;
  try {
    const [list, param] = await dbConnection.query(queryString);
  
    if (list.length === 0) {
      console.log("Duomenų bazėje nėra saugomas toks tokenas!");    
      return false;
    }
    
    const {createdAt} = list[0];
    console.log(createdAt, " => ", createdAt.getTime());
    
    // ------------------     ↓↓ - minutes - galiojimo laikas
    if (createdAt.getTime() + 2 * 60000 < new Date().getTime()) {
      console.log("Baigesi tokeno galiojimas duomenu bazeje ...!");    
      return false
    }    
  } catch (error) {
    console.log("Klaida jungiantis prie duomenų bazės", error);    
  }

  return true;
}

/**
 * Periodinis įrašų duomenų bazėje valymas. 
 * Tikėtinas periodas - para (1440 min.) užduodamas faile index.ts
 * @param checkInterval - laikas minutėmis (t. y. dar *60*1000)
 */
export async function deleteOldTokens(checkInterval: number, dbConnection: Connection) {
  const currentTime = new Date().getTime();
  
  // ============   darbas su duomenų baze ...   =============================
  try {
    const [list, param] = await dbConnection.query(`SELECT * FROM tokens`);
    for (const item of list) {
      const {token, createdAt} = item;
      if (currentTime - createdAt.getTime() > checkInterval * 60 * 1000) {
        console.log(`Tokeną ${token} metas trinti.`);
        await dbConnection.query(`DELETE FROM tokens WHERE token='${token}'`);
      }
    }    
  } catch (error) {
    console.log("Klaida nuskaitant tokenus ↓");
    console.log(error);      
  }
}



