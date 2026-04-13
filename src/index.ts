// import { file } from './lib/file.js';
import { Connection } from 'mysql2/promise';
import { databaseSetup } from './lib/dbSetup.js';
import { server } from './lib/server.js';
import { deleteOldTokens } from './lib/utils.js';


export const initialFilesStructure = () => {
  console.log("Creating folders...");
  console.log("Creating files...");  
}

export const  init = async () => {
  console.clear();
  console.log('App init ...');

  try {
    const dbConnection: Connection = await databaseSetup();
    server.init(dbConnection);

    // išvalyti nebegaliojančius /data/token/*.json failus
    // para: 24*60*60*1000 milisekundžių
    const checkInterval: number = 60; // in minutes
    setInterval(() => {
      deleteOldTokens(checkInterval);
    }, checkInterval*60*1000);
    
  } catch (error) {
    console.log("Klaida programos inicijavime", error);    
  }  
};

export const app = {
  init,
  initialFilesStructure,
};

app.init();

 
