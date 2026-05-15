let mongoose=require('mongoose')

let connectDb=async()=>{
try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('mongoDb connected successfully')
} catch (error) {
console.log('error in connecting mongodb')    
}
}

module.exports=connectDb