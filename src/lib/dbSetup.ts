import mysql, { Connection } from 'mysql2/promise';

// gauti prisijungimą prie DB
//  jei nėra DB -  sukurti (services-platform)
//  jei nėra lentelių - sukurit (services, tokens, users, admin-user)

export async function databaseSetup(): Promise<Connection> {
  const connection: Connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'service-platform',
  });
  
  return connection;
}

