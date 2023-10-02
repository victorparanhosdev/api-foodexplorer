class AppError {
    constructor(message, statusCode = 404){
        this.message = message,
        this.statusCode = statusCode
    }
}


module.exports = AppError