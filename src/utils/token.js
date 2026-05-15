let  jwt=require('jsonwebtoken')
let generateAccessToken=(userId)=>{
return  jwt.sign({userId},process.env.JWT_SECRET_ACCESS,{
    expiresIn:'1d'
})
}
let generateRefreshToken=(userId)=>{
return  jwt.sign({userId},process.env.JWT_SECRET_REFRESH,{
    expiresIn:'30d'
})
}

module.exports={
    generateAccessToken,
    generateRefreshToken
}