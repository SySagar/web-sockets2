const socket = io()
const form = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

//get username and room from url
const {username , room} = Qs.parse(location.search ,{
    ignoreQueryPrefix : true
})

//join room
socket.emit('joinRoom' , {username , room})

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