const generateMessage=(username,text)=>{
    return{
        username:username,
        text:text,
        createdAt:new Date().getTime()
    }
}
const generateLocation=(username,latitude,longitude)=>{
    
    return{
        username:username,
        text:`https://google.com/maps?q=${latitude},${longitude}`,
        createdAt:new Date().getTime()
    }
}



module.exports={
    generateMessage,
    generateLocation
}