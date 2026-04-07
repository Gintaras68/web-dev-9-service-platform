// import { file } from './lib/file.js';
import { server } from './lib/server.js';
import { deleteOldTokens } from './lib/utils.js';

console.clear();

export const initialFilesStructure = () => {
  console.log("Creating folders...");
  console.log("Creating files...");  
}

export const  init = () => {
  console.log('App init ...');
  server.init();
  
  // išvalyti nebegaliojančius /data/token/*.json failus
  // para: 24*60*60*1000 milisekundžių
  const checkInterval: number = 60; // in minutes
  setInterval(() => {
    deleteOldTokens(checkInterval);
  }, checkInterval*60*1000);
};

export const app = {
  init,
  initialFilesStructure,
};

app.init();

 