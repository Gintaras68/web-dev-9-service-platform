import { server } from './lib/server.js';

console.clear();

export const initialFilesStructure = () => {
  console.log("Creating folders...");
  console.log("Creating files...");  
}

export const init = () => {
  console.log('App init ...');
  server.init();
  setInterval(() => {
    // išvalyti nebegaliojančisu /data/token/*.json failus
  }, 24*60*60*1000);
};

export const app = {
  init,
  initialFilesStructure,
};

app.init();
