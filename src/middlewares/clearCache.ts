import { NextFunction, Request, Response } from "express";
import { clearCache } from "../services/cache";

const clearCacheMW = async (req:Request, res:Response, next:NextFunction) => {
    // Execute clearCache Function after route handler executed successfully
    await next();

    clearCache(req.user._id);
}

export default clearCacheMW;