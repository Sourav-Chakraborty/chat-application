const socket=io()
//----------------------------------------------------------------------
//elements
const $messageForm=document.querySelector('#Messageform')
const $messageFormInput= $messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#sendlocation')
const $messages=document.querySelector('#messages')

//-------------------------------------------------------------------------------
//templates
const messagetemplate=document.querySelector('#messagetemplate').innerHTML
const locationtemplate=document.querySelector('#locationtemplate').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML


//--------------------------------------------------------------------------------------
//to print any message through server

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})//parsing the result to get the username & room name

const autoscroll=()=>{
    //new message element
    const $newMessage=$messages.lastElementChild

    //height of the new message
    const newmessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newmessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
   
    //visible height
    const visibleHeight=$messages.offsetHeight

    //height of message container
    const containerHeight=$messages.scrollHeight
    //how far have i scrolled?
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight

    }

}



socket.on('locationMessage',(url)=>{
    console.log(url)
    const html=Mustache.render(locationtemplate,{
        username:url.username,
        url:url.text,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})






socket.on('message',(message)=>{//accepting from client
    console.log(message)
    const html=Mustache.render(messagetemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on('roomdata',({room,users})=>{
    const html=Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})




//--------------------------------------------------------------------------------------
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message=e.target.elements.Message.value
    socket.emit('sendMessage',message,(dis)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=""
        $messageFormInput.focus()
        if(dis==true)
            return console.log("Message not sent as you used slangs")
        console.log("Message is delivered ")
    })
})

$locationButton.addEventListener('click',()=>{
    $locationButton.setAttribute('disabled','disabled')
    $messageFormButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        $locationButton.removeAttribute('disabled')
         $messageFormButton.removeAttribute('disabled')
        return alert("Geolocation is not supported by your browser")
    
    }
    navigator.geolocation.getCurrentPosition((position)=>{//fetching the location
       
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log("Location shared")

        })
    })
    $locationButton.removeAttribute('disabled')
    $messageFormButton.removeAttribute('disabled')
})

//---------------------------------------------------------------
//requesting to the server
socket.emit('join',{username,room},(error)=>{
    if(error){   //if the username already taken redirect the user to homepage
        alert(error)
        location.href='/'
    }
})