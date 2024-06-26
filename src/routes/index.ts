import { Request, Response, NextFunction,Router } from 'express';

import userRoutes from './users';
import postRoutes from './posts';

import authRoutes from './auth';


const router = Router()

router.use("/v1/auth", authRoutes)
router.use("/v1/users", userRoutes)
router.use("/v1/posts", postRoutes)


export default router;
