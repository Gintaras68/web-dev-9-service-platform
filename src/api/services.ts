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

  return {
    statusCode: 200,
    headers: {},
    body: 'Services list data.',
  };
};

api.post = async (data: DataForHandlers): Promise<APIresponse> => {
  const { dbConnection } = data;

  const title: string = 'Pavadinimas';
  const description: string = 'Trumpas aprasymas';
  const price: number  = 4.00;

  const queryString =`INSERT INTO services (title, description, price, photo, isActive) VALUES ('${title}', '${description}', '${price}', 'photo', '1')`;

  // A simple SELECT query
  try {
    await dbConnection.query(queryString);
  } catch (err) {
    console.log(err);
  }

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

