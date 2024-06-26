import { Application } from 'express';
import config from './index'
import redisClient from './redis.config';
const { port } = config.app;

const startExpressApp = (app :Application) =>{
    app.listen( port || 4000, () => {
        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
            process.exit(0);
        });
        
        // If the connection is successful
        redisClient.on('connect', () => {
            console.log('Connected to Redis');
        });
        console.log(`Server Running here 👉 http://localhost:${port}`);
    });
}

export default startExpressApp;