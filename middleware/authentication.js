const CustomError = require ('../errors')
const {isTokenValid} = require ('../utils')

const authenticateUser = async(req,res,next) =>{
    const token = req.signedCookies.token

    if(!token) {
        throw new CustomError.UnauthenticatedError('authentiaction invalid')
    }
    try {
        const {name,userId,role} = isTokenValid({token})
        req.user={name,userId,role}
    next()
    }
    catch (error){
        throw new CustomError.UnauthenticatedError('authentiaction invalid')
    }
}


const authorizePermissions = (...roles) =>{
    return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        throw new CustomError.UnauthorizedError('unauthorized to access this route')
     }
     next()
     }
  
}

module.exports = {authenticateUser,authorizePermissions}