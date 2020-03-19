const redis = require('redis');
const genericPool = require('generic-pool');

const { CONCURRENCY } = process.env;
console.log('CONCURRENCY', CONCURRENCY);

const factory = {
  create: () => new Promise((resolve, reject) => {
    const client = redis.createClient();
    client.on('error', (err) => {
      try {
        client.end(false);
      } catch (error) {
        console.error(error);
      }
      console.error(err);
      reject(err);
    });
    client.on('end', () => { console.log('Conexion redis cerrada'); });
    client.on('ready', () => resolve(client));
  }),
  destroy: (client) => new Promise((resolve, reject) => {
    client.end(false); // force connection close, so no more commands are processed
    resolve();
  }),
  validate: () => Promise.resolve(true),
};
module.exports = () => new genericPool.createPool(factory, {
  max: CONCURRENCY,
  idleTimeoutMillis: 5000,
});
