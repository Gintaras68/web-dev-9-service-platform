import { server } from './lib/server.js';

console.clear();

export const init = () => {
  console.log('App init ...');
  server.init();
};

export const app = {
  init,
};

app.init();
