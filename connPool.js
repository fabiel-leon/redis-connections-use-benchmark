const { promisify } = require('util');
const pool = require('./pool');

module.exports = (testdata) => async () => {
  console.log('Start Connection pool');
  let count = 0;
  const startDate = Date.now();
  const redisPool = pool();

  while (Date.now() - startDate < 5000) {
    const res = await redisPool.use(async (client) => {
      const get = promisify(client.get).bind(client);
      const set = promisify(client.set).bind(client);
      const setVal = await set(`key${count}`, JSON.stringify(testdata));
      return get(`key${count}`);
    });
    count += 1;
  }
  await redisPool.drain();
  await redisPool.clear();
  console.log('Connection pool', count, 'realtime:', Date.now() - startDate);
  return count;
};
