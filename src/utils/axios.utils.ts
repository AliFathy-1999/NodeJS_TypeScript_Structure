import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../lib';
import { errorLogger, httpLogger, logger } from './logger';
import { query, Request } from 'express';

const apiClient = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', // Change this to your API
    timeout: 5000, // Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config:InternalAxiosRequestConfig) => {
        config.startTime = new Date();
       (config as any).metadata = {
            startTime: new Date(),
            request: {
                method: config.method,
                url: config.url,
                headers: config.headers,
                params: config?.params && Object.keys(config?.params)?.length > 1 ? config.params: undefined,
                IPAddress: config["ip"],
                data: config.data,
            },
        };
        // console.log(`[Request] ${req.method?.toUpperCase()} ${req.url}`);
        // // Example: Adding Authorization Token (Modify as needed)
        // const token = 'your_auth_token'; // Fetch dynamically if needed
        // if (token) {
        //     req.headers.Authorization = `Bearer ${token}`;
        // }
        
        return config;
    },
    (error) => {
        errorLogger(error,"axios-call")
        console.error('[Request Error]', error);
        return Promise.reject(new ApiError(error.message, 500));
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        const start = (response.config as InternalAxiosRequestConfig).metadata?.startTime;
        const duration = start ? Date.now() - new Date(start).getTime() : null;

        const axiosResponse: Partial<AxiosResponse> = {
            status: response.status,
            data: response.data
        }
        httpLogger(response.config.metadata,axiosResponse,"AXIOS_CALLS",duration)
        return response;
    },
    (error) => {
        console.error('[Response Error]', error);

        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log('Error Response:', error.response.data);
                return Promise.reject(new ApiError(error.response.data?.message || 'API Error', error.response.status));
            } else if (error.request) {
                console.log('No Response:', error.request);
                return Promise.reject(new ApiError('No response from server', 500));
            }
        }

        return Promise.reject(new ApiError(error.message || 'Unknown error', 500));
    }
);

// Function to send requests
const sendAxiosRequest = async (axiosConfig: AxiosRequestConfig): Promise<AxiosResponse | ApiError> => {
    try {
        const response = await apiClient.request(axiosConfig);
        return response;
    } catch (error) {
        throw error; // The interceptor already handles errors
    }
};


export {
    sendAxiosRequest
}