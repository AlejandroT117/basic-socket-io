const btnEl = document.getElementById('socket-btn')


const user = {};
//iniciar socket i
user.socket = io();

btnEl.addEventListener('click', ()=>{
  
  user.socket.on("chat", 'mensaje de prueba');
})