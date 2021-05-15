const users=[]
//adduser,removeUser,getUser,getUsersInRoom
const addUser=({id,username,room})=>{
    //clean data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username || !room){  
        return {
            error:'username & room are required'
        }

    }
    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room === room && user.username === username

    })

    if(existingUser){
        return {
            error:"Username is in use"
        }
    }
    const user={id,username,room}
    users.push(user)
    return {
        user
    }

}

const removeUser=(id)=>{
    const index=users.findIndex((user)=> user.id===id)
    if(index!=-1)
        return users.splice(index,1)[0]
}



const getUser=(id)=>{
    const index=users.findIndex((user)=> user.id===id)
    if(index!=-1)
        return users[index]
    return undefined
}

const getUsersInRoom=(room)=>{
    const u=[]
    const t=users.filter((user)=>{
        if(user.room===room)
             u.push(user)
    })
    return u
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}