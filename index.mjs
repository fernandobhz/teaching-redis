import redis from "redis";
import { fnCache } from "./cache.mjs";
import { GenericDatabase } from "./genericDatabase.mjs";

const { log } = console;

const redisClient = redis.createClient();
await redisClient.connect();

try {
  log("Using Redis");
  const myResult = await fnCache(redisClient, (a, b) => a + b, 2, 3);
  log({ myResult });
} catch (error) {
  error(error);
}

const genericDatabase = new GenericDatabase();

try {
  log("Using literal object - 1st time");
  const myResult = await fnCache(genericDatabase, (a, b) => a + b, 2, 3);
  log({ myResult });
} catch (error) {
  error(error);
}

try {
  log("Using literal object - 2nd time");
  const myResult = await fnCache(genericDatabase, (a, b) => a + b, 2, 3);
  log({ myResult });
} catch (error) {
  error(error);
}

await redisClient.disconnect();
