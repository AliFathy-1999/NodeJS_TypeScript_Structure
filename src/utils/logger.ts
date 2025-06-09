import winston, { format, createLogger, transports, Logger } from 'winston';
const { combine, timestamp, label, prettyPrint, json } = format;

import config from "../config";
import { Request, Response } from 'express';
import { orderObject, removeFalsyValues, removeSensitiveData } from './data.utils';

import moment from 'moment';
import { IinfoLogger, IloggerParams } from '../interfaces/utils.interface';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import stringify from "json-stringify-safe"
const { app: { environment } } = config;

let logsObjData: IinfoLogger = {
    Request: {
        source: process.env.SERVER_NAME,
        serviceName: "",
        elapsed: "0",
        endPoint: "",
        url: "",
        method: "",
        IPAddress: "",
        headers: {},
        params: {},
        query: {},
        body: {},
        userId: null,
    },
    Response: {
        body: {},
        statusCode : 0,
        statusMessage: ""
    }
}
const createLogData = (req: Request, res: Response, serviceName?: string, elapsed?: number): IinfoLogger => {
    delete req.headers.authorization;
    delete req.headers.cookie;
    return {
        Request: removeFalsyValues({
            source: process.env.SERVER_NAME,
            serviceName: `${serviceName}-service`,
            elapsed: `${elapsed}ms`,
            method: req.method,
            url: req.originalUrl,
            endPoint: req.url,
            headers: req.headers,
            query: req.query,
            params: req.params,
            body: req.body,
            IPAddress: req.ip,
            userId: req.user?._id || null,
        }),
        Response: removeFalsyValues({
            statusCode: res.statusCode,
            body: res.responseBody,
            statusMessage: res.statusMessage
        })
    };
};

const logsFormat = (logsData: { [key:string]: any })=> {
    const blackList = JSON.parse(process.env.BLACKLIST_DATA)
    const sanitizedLogsData = removeSensitiveData(logsData, blackList);
    return sanitizedLogsData
}

const loggerLevel = (): string => {
    const env = process.env.NODE_ENV;
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'info'; 
}
const levels = {
    crit: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7
};
const customFormat = winston.format.combine(
    winston.format.printf(({ level, timestamp, ...rest}) => {
        return stringify({ level, timestamp , message: rest.message })
    }),
);

const logger: Logger = createLogger({
    level: loggerLevel(),
    levels,
    format: combine( 
        timestamp({
            format: () => moment().format('MMMM Do YYYY, h:mm:ss a'),
        }),
        customFormat,
    ),
    transports: [
        new winston.transports.Console(),
        new transports.File({
            filename: "./logs/combined.log",
        }),
        new transports.File({
            level: "error",
            filename: "./logs/error.log",
        }),
    ],
});

// logger.exceptions.handle(
//     new transports.File({ filename: './logs/exceptions.log' })
// );
const errorLogger = (arg: string | IloggerParams, source: string = process.env.SERVER_NAME ) => {
	// console.log('arg:', arg)
    if (typeof arg === 'string') {
        logger.error({ message: arg, source });
    }else if(typeof arg === "object" && source == process.env.SERVER_NAME){
        const { req, res, serviceName, elapsed } = arg as any
        const logsObjData = createLogData(req, res, serviceName, elapsed);
        console.log('logsObjData:', logsObjData)
        logger.error(logsFormat(logsObjData));
    }else {
        logger.error({ ...arg.errorObj, source })
    }
}
const warnLogger = (message: string, source: string = process.env.SERVER_NAME) => {
    logger.log("warn", { source, message  } );
}

const infoLogger = (arg: string | IloggerParams,source: string = process.env.SERVER_NAME) => {
    if (typeof arg === 'string') {
        logger.info({ message: arg, source });
    }else {
        const { req, res, serviceName, elapsed } = arg as any
        const logsObjData = createLogData(req, res, serviceName, elapsed);
        logger.info(logsFormat(logsObjData));
    }
}

const httpLogger = (req:Request | AxiosRequestConfig, res:Response | Partial<AxiosResponse>, serviceName:string, elapsed?: number) => {
    logger.http({serviceName, Request: req, Response: res, elapsed  });
}

const criticalLogger = (message:string, source: string = process.env.SERVER_NAME) => {
    logger.crit({ source, message });
}

const debugLogger = (message:string | Object ) => {
    logger.debug(message);
}

if (environment !== 'production') {
    logger.add(new winston.transports.Console({
        format: format.simple(),
    }));
}


export { 
    httpLogger, 
    errorLogger, 
    criticalLogger, 
    infoLogger,
    warnLogger,
    debugLogger,
    logger
};