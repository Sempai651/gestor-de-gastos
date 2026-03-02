import {Request, Response, NextFunction} from 'express';
import {ResponseService} from '../utils/response'
import {ApiError} from '../utils/error';


export const errorHandler = (err:  Error | ApiError,req: Request,res: Response,) => {

    console.log('Error:', err);
if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
        ResponseService.error(err.code, err.message, err.statusCode)
    );
    }
    return res.status(500).json(
        ResponseService.error('INTERNAL_ERROR', 'Error interno del servidor', 500)

    );
};








