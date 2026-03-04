

/**
 * creamos una clase que nos da errores mas detallados 
 */

export class ApiError extends Error {
    constructor (
        public statusCode: number,
        public code: string,
        message: string
    ){
        super(message);
        this.name= 'ApiError';
    }
}