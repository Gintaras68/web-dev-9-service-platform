import { APIresponse, DataForHandlers } from '../lib/server.js';
// import { Connection } from 'mysql2/promise';

export async function servicesAPI(data: DataForHandlers): Promise<APIresponse> {
  const availableHttpMethods = ['get', 'post', 'put', 'delete'];

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

api.get = async (data: DataForHandlers): Promise<APIresponse> => {
  console.log('service API response ... Services list data.');
  const {user} = data;
  return {
    statusCode: 200,
    headers: {user},
    body: 'Services list data.',
  };
};

api.post = async (data: DataForHandlers): Promise<APIresponse> => {
  const { dbConnection, payload } = data;  
  const {title, description, price, photo} = payload;
  let {isActive} = payload;
// console.log("\nServices API gavo objektą: ", payload);

  if (isActive !== '1' && isActive !== '0') {
    isActive = '1';
  }

  if (typeof title !== 'string' || title === ''
    || typeof description !== 'string' || description === ''
    || typeof photo !== 'string' || photo === '' 
    || typeof price !== 'number' || price < 0) {
    console.log("Service Object in NOT Valid");
    return {
      statusCode: 422,
      headers: {},
      body: 'Service Object in NOT Valid.',
    };
  }

  const queryString =`INSERT INTO services (title, description, price, photo, isActive) VALUES ('${title}', '${description}', '${price}', '${photo}', '${isActive}')`;

  try {
    await dbConnection.query(queryString);
  } catch (err) {
    console.log(err);
  }
  console.log("Service was created.");
  
  return {
    statusCode: 201,
    headers: {},
    body: 'Service created.',
  };
};

api.put = async (data: DataForHandlers): Promise<APIresponse> => {
  console.log('service API response ... Service updated.');

  return {
    statusCode: 200,
    headers: {},
    body: 'Service updated.',
  };
};

api.delete = async (data: DataForHandlers): Promise<APIresponse> => {
  console.log('service API response ... Service deleted.');

  return {
    statusCode: 200,
    headers: {},
    body: 'Service deleted.',
  };
};