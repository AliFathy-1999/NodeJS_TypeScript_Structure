import express,{ Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import  morgan from 'morgan';
import helmet from 'helmet';
import sanitizer from 'express-sanitizer';
import cookieParser from 'cookie-parser';

import  limiter from './utils/rate-limiter'
import {ApiError, handleResponseError} from './lib/index'
import swaggerSpec from './utils/swagger'; // Import your swaggerSpec
const swaggerUi = require('swagger-ui-express');

import router from './routes/index'
import errorMsg from "./utils/messages/errorMsg";
import { StatusCodes } from "http-status-codes";
import path from "path";

const app :Application = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(limiter);
app.use(sanitizer());
app.use(cookieParser());

//SSR 
app.set('view engine', 'ejs');
app.set('templates', path.join(__dirname, 'templates'));

app.use('/api/', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.all('*',async (req:Request, res:Response,next:NextFunction) => {
    next(new ApiError(errorMsg.RouteNotFound(req.originalUrl), StatusCodes.NOT_FOUND));
})

app.use(handleResponseError);




export default app;