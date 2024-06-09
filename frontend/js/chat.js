'use strict';
const socket = io();
const port = 5000;

const chatForm = document.querySelector('.chat-form');
const typingInput = chatForm.querySelector('input');
const messagesList = document.querySelector('.messages-list');

let userId = localStorage.getItem('currentUserId');
const chatSound = document.getElementById('chat-sound');
const chatContactTyping = document.querySelector('.chatting-contact__typing');
let user = [];
const chatNotificationSound = document.querySelector('#chat-notification');


fetch(`/getUser`, {
  headers: {
    "Content-Type": "application/json; charset=UTF-8"
  },
  method: 'POST',
  body: JSON.stringify({userId})
})
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      user.push(data.user);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

// Manage time part of project

const currentTime = new Date();
const getCurrentHour = currentTime.getHours();
const getCurrentMinute = currentTime.getMinutes();

function addZero(number) {
  if (number < 10) {
    return `0${number}`
  }
  return number
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!typingInput.value) {
    return;
  }
  socket.emit('chat', {
    message: typingInput.value,
    name: user[0].name,
    getCurrentHour,
    getCurrentMinute,
    userId: user[0]._id
  });
  typingInput.value = '';
  setTimeout(() => {
    chatSound.play();
  }, 100)
  messagesList.scrollTop = messagesList.scrollHeight;
});


typingInput.addEventListener('keypress', () => {
  socket.emit('typing', [`${user[0].name}`]);
})

socket.on('chat', data => {
  if (data.userId !== userId) {
    chatNotificationSound.play();
  }
  messagesList.innerHTML += `
         <li class="message ${data.userId === userId ? "send" : "received"}">
            <strong class="name">${data.name}</strong>
            <p>${data.message}</p>
            <time class="message-time">${data.getCurrentHour} : ${addZero(data.getCurrentMinute)}</time>
         </li>
         `
  messagesList.scrollTop = messagesList.scrollHeight;
});


let timer = setTimeout(makeNoTypingState, 1000);

socket.on('typing', data => {
  clearTimeout(timer);
  timer = setTimeout(makeNoTypingState, 1000);

  if (data.length > 1 && data.length < 3) {
    return chatContactTyping.innerHTML = `${data[0]}, ${data[1]} are typing a message...`;
  }
  if (data.length > 3) {
    return chatContactTyping.innerHTML = `${data[0]}, ${data[1]} and others are typing a message...`;
  }
  chatContactTyping.innerHTML = `${data} is typing a message...`;
});


function makeNoTypingState() {
  chatContactTyping.innerHTML = "";
}


const darkLayer = document.querySelector('.dark-layer'),
    videoCall = document.querySelector('#video-call'),
    videoCallEndBtn = document.querySelector('.video-call__option--item:first-child'),
    avatarImg = document.querySelector('.avatar-img'),
    videoCallEndSound = document.querySelector('#call-end-sound');

const userInfoWrapper = document.querySelector('.user-info-wrapper');
const userInfoCloser = document.querySelector('.user-info-closer');
const logOutForm = document.querySelector('.log-out-form')


videoCall.addEventListener('click', () => {
  setTimeout(() => {
    darkLayer.classList.remove('hide');
  }, 1000)
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    darkLayer.classList.add('hide');
  }
})

videoCallEndBtn.addEventListener('click', endVideoCall);

darkLayer.addEventListener('click', e => {
  if (e.target === darkLayer) {
    endVideoCall();
  }
})


window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    userInfoWrapper.classList.add('hide');
  }
});

userInfoWrapper.addEventListener('click', e => {
  if (e.target === userInfoWrapper) {
    userInfoWrapper.classList.add('hide')
  }
});

userInfoCloser.addEventListener('click', () =>{
  userInfoWrapper.classList.add('hide')
});


avatarImg.addEventListener('click', () => {
  userInfoWrapper.classList.remove('hide');
});

// End video call Handler function
function endVideoCall() {
  setTimeout(() => {
    darkLayer.classList.add('hide');
    videoCallEndSound.play();
  }, 1000)
}

logOutForm.addEventListener('submit', async (e) => {
  let response = await fetch(`/logout`, {
    method: 'POST'
  })
  response = await response.json();

  if (!response.ok) {
   alert('Please try again');
  }
  if(response.ok) {
    window.location.reload();
  }
})



