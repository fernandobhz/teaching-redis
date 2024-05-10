import crypto from 'crypto';

const { log } = console;

function generateHash(data) {
    return crypto.createHash('sha256').update(data).digest('base64');
}


export async function fnCache(genericDatabase, worker, ...args) {
  const argsJson = JSON.stringify(args);
  const cacheKey = generateHash(argsJson);
  const cachedResult = await genericDatabase.get(cacheKey);

  if (cachedResult) {
    log("Returning data from cache");
    const result = JSON.parse(cachedResult);
    const origin = 'cache';
    return { result, origin };
  }

  log("Asking worker to perform their job then returning caching it and returning the result");
  const result = await worker(...args);
  await genericDatabase.set(cacheKey, JSON.stringify(result));
  const origin = 'worker';
  return { result, origin };
}
