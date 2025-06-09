import 'axios';

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        startTime?: string | Date;
        metadata: Record<string,any>
    }
}
