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
  const { dbConnection, payload } = data;

// -------   tikrinami gauti iš naršyklės duomenys ... --------------
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

  type userObj = {
    id: number,
    username: string,
    email: string,
    password: string,
    registeredAt: any
  }
 
  // -----   gauname vartotojo veikiantį slaptažodį     ------
  // ----------- (nuskaitom iš duomenų bazės)   --------------
  let userObj = {} as any | userObj;
  try {
    const responseData = await dbConnection.query(`SELECT * FROM users WHERE email='${payload.email}'`);
    userObj =responseData[0][0];

    console.log("Got answer DB: ", responseData);
    console.log("Got user from DB: ", userObj);
    
    if (userObj.password !== payload.password) {
      console.log('Wrong email or/and password.');      
      return {
        statusCode: 409,
        headers: {},
        body: 'Wrong email or/and password.',
      };
    }      
  } catch (error) {
    console.log("Error connecting with DB ...");    
  }

  // ------   generuojamas tokenas .... -------------------------------
  const abc = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789';
  let token = '';
  for (let i = 0; i < 20; i++) {
    const index = Math.floor(Math.random() * abc.length);
    token += abc[index];
  }
  
  // -------   tokenas įrašomas į duomenų bazę kartu su e-mailu ir data
  const queryString =`INSERT INTO tokens (email, token) 
        VALUES ('${payload.email}', '${token}')`;
  try {
    await dbConnection.query(queryString);    
  } catch (error) {
    console.log("Klaida iterpiant tokena");    
  }

  // -------    formuojamas cookie klientui      -------------------------
  const timeToDelete = 200;
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
