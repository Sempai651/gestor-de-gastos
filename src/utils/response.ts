


export class ResponseService {

static success(data: any, statusCode = 200){
    return {
        success: true,
        statusCode,
        data,
        error: null
};

}

static error(code: string, message: string, statusCode  = 500 ){

    return {
        success: false,
        statusCode,
        data: null,
        error:{
            code,
            message
        }
    };

}

}