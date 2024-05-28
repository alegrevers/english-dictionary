import * as redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export { client, getAsync, setAsync };
