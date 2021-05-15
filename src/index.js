 //-------------------------------------------------------------
 const path=require('path')
  const http=require('http')                                          //loading important modules
 const express=require('express')
 const socketio=require('socket.io')
 const Filter=require('bad-words')
 const {generateMessage}=require('./utils/messages')
 const {generateLocation}=require('./utils/messages')
const {addUser, removeUser,getUser,getUsersInRoom}=require('./utils/users')

 //----------------------------------------------------------------
 //showing index.html page of public directory
 const app=express()
 const server=http.createServer(app)
 const io=socketio(server)//merging socketio with existing server
 const port=process.env.PORT || 3000
 const publicDirectoryPath=path.join(__dirname,'../public')//path of public directory
 app.use(express.static(publicDirectoryPath))//using index.html at port 3000
 //------------------------------------------------------------------------------

 let count=0
 io.on('connection',(socket)=>{
     //announcing a action,on connection action it will run the call back function
     console.log("New Connection")

     socket.on('join',({username,room},callback)=>{
         const {error,user}=addUser({id:socket.id,username,room})
         if(error){
             return callback(error)
         }
        socket.join(user.room)//joining a specific room 

        socket.emit('message',generateMessage('admin','Welcome'))//sending to client public/src/chat.js
        socket.broadcast.to(user.room).emit('message',generateMessage(`${username} has joined the room`))//send message to all user except current one inside the room
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
         callback()
    })



   
    socket.on("sendMessage",(message,callback)=>{//accepting to client
        const user=getUser(socket.id)

        
        const filter=new Filter()
        
        if(filter.isProfane(message)){
            return callback(true)
        }
         // socket.emit('countUpdated',count) work for only client
         io.to(user.room).emit('message',generateMessage(user.username,message))//sending result to all clients
        callback(false)
    })

    socket.on("disconnect",()=>{//when any user left,message all other that someone has left
       const user=removeUser(socket.id)
       if(user){  
         io.to(user.room).emit('message',generateMessage('admin',`${user.username} has left the room`))
         io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
       }
    })
    socket.on('sendLocation',(coords,callback)=>{//sending location of a user to all other clients
        const user=getUser(socket.id)
        console.log("the latitude",coords.latitude)
    console.log("the longitude",coords.longitude)
        io.to(user.room).emit('locationMessage',generateLocation(user.username,coords.latitude,coords.longitude))
        callback()
    })
})

 //--------------------------------------------------------------------------------
 server.listen(port,()=>{//launching the server
     console.log("Server is at port 3000!")
 
 })
//---------------------------------------------------------------------
//websocket 
