const { promisify } = require('util');
const { queue } = require('async');
const pool = require('./pool');

const { CONCURRENCY } = process.env;

module.exports = (testdata) => async () => {
  console.log('Start Concurrent Pool connection');
  let count = 0;
  const redisPool = pool();

  const q = queue(async () => {
    const res = await redisPool.use(async (client) => {
      const get = promisify(client.get).bind(client);
      const set = promisify(client.set).bind(client);
      const setVal = await set(`key${count}`, JSON.stringify(testdata));
      return get(`key${count}`);
    });
    count += 1;
    // callback();
  }, CONCURRENCY);
    // assign an error callback
  q.error((err, task) => {
    console.error('task experienced an error', err);
  });
  const startDate = Date.now();
  q.push(new Array(500000).fill('a'));
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      q.pause();// pause processing
      q.kill();// clear queue
      await redisPool.drain();
      await redisPool.clear();
      console.log('Concurrent Pool connection', count, 'realtime:', Date.now() - startDate);
      resolve(count);
    }, 5000);
  });
};
