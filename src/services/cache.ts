import redisClient from "../config/redis.config"

const clearCache = (hashKey: string): void => {
    //Called when there are changes in data cached
    redisClient.del(JSON.stringify(hashKey))    
}

export {
    clearCache
}