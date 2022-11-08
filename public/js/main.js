const socket = io()
const form = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const usersList= document.getElementById('users')

//get username and room from url
const {username , room} = Qs.parse(location.search ,{
    ignoreQueryPrefix : true
})

//join room
socket.emit('joinRoom' , {username , room})


//get room and users
socket.on('roomUsers',({room,users})=>{

    outRoomName(room)
    outUsers(users)
})

socket.on('message',message=>{
    console.log(message);
    console.log("hgb")
    outMessage(message)

    //for every message scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight
})

//message submit
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    socket.emit('chatMessage',msg);

    //clear input 
    e.target.elements.msg.value=''
    e.target.elements.msg.focus()
})

function outMessage(message)
{
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = '<p class="meta">'+message.username+' <span>'+message.time+'</span></p><p class="text">'+message.text+'</p>'
    document.querySelector('.chat-messages').appendChild(div)

    console.log(div.innerHTML);
}

//add room name to dom
function outRoomName(room)
{
    roomName.innerText = room;
}

//add users to dom
function outUsers(users)
{
   usersList.innerHTML=''+users.map(user => '<li>'+user.username+'</li>').join('')
}