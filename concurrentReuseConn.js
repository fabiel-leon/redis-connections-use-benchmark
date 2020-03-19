const { promisify } = require('util');
const redis = require('redis');
const { queue } = require('async');

const { CONCURRENCY } = process.env;

module.exports = (testdata) => async () => {
  console.log('Start Concurrent Reusing connections');
  let count = 0;
  const client = redis.createClient();
  const get = promisify(client.get).bind(client);
  const set = promisify(client.set).bind(client);

  const q = queue(async (task) => {
    const setVal = await set(`key${count}`, JSON.stringify(testdata));
    const getVal = await get(`key${count}`);
    count += 1;
    // callback();
  }, CONCURRENCY);
    // assign an error callback
  q.error((err, task) => {
    console.error('task experienced an error', err);
  });
  const startDate = Date.now();
  q.push(new Array(1000000).fill('a'));
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      q.pause();
      q.kill();
      const msg = await client.end(false);// forcing killing the connection  so no more commands are completed
      console.log('Concurrent Reusing connections', count, 'realtime:', Date.now() - startDate);
      resolve(count);
    }, 5000);
  });
};
