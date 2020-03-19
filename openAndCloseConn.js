const redis = require('redis');
const { promisify } = require('util');

module.exports = (testdata) => async () => {
  console.log('Start Opening and Closing connections');
  let count = 0;
  const startDate = Date.now();
  while (Date.now() - startDate < 5000) {
    const client = redis.createClient();
    const get = promisify(client.get).bind(client);
    const set = promisify(client.set).bind(client);
    const quit = promisify(client.quit).bind(client);
    const setVal = await set(`key${count}`, JSON.stringify(testdata));
    const getVal = await get(`key${count}`);
    const msg = await quit();
    count += 1;
  }
  console.log('Opening and Closing connections', count, 'realtime:', Date.now() - startDate);
  return count;
};
