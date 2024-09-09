export default function makeRedisClient({ Redis, logger, cacheConfig }) {
  return Object.freeze({
      setCache,
      getCache
    })
  
    async function setCache({ data, cacheKey }) {
      
      try {
        console.log(cacheConfig, 'cacheConfig');
        
        const redisClient = await createClient();
    
        const inputData = JSON.stringify(data);
        console.log(inputData, 'inputData');
        
        await redisClient.set(cacheKey, inputData);
        await redisClient.expire(cacheKey, cacheConfig.ttl);
        
        await redisClient.quit();
        
        return;
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
    
    async function getCache({ cacheKey }) {
      try {
        console.log(cacheConfig, 'cacheConfig');
        
        const redisClient = await createClient();
        
        const results = await redisClient.get(cacheKey);
        console.log(results, 'results');
        
        await redisClient.quit();
        
        return results;
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
    

  async function createClient() {
    try {
      console.log(cacheConfig, 'cacheConfig');
      
      const client = Redis.createClient(cacheConfig);
      
      client.on('error', err => {
        logger.error('Redis Client Error', err);
      });
      
      await client.connect();
      
      return client;
    } catch (err) {
      logger.error('Error creating Redis client', err);
      throw err;
    }
  }
}