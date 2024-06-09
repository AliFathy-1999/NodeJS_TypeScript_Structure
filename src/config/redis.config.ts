import * as redis from 'redis'

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
})

export default redisClient;