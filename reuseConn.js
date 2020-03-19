const redis = require('redis');
const { promisify } = require('util');

module.exports = (testdata) => async () => {
  console.log('Start Reusing connections');
  let count = 0;
  const startDate = Date.now();
  const client = redis.createClient();
  const get = promisify(client.get).bind(client);
  const set = promisify(client.set).bind(client);
  const quit = promisify(client.quit).bind(client);
  while (Date.now() - startDate < 5000) {
    const setVal = await set(`key${count}`, JSON.stringify(testdata));
    const getVal = await get(`key${count}`);
    count += 1;
  }
  const msg = await quit();
  console.log('Reusing connections', count, 'realtime:', Date.now() - startDate);
  return count;
};
