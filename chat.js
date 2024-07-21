const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');


function sendMessage() {
    const message = messageInput.value;
    if (message) {
        postMessage(senderName, message);
        messageInput.value = '';
    }
}

function postMessage(sender, message) {
    db.collection('messages').add({
        sender: sender,
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log('Message sent:', message);
    }).catch((error) => {
        console.error('Error sending message:', error);
    });
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(message.sender === senderName ? 'self' : 'other');
    messageElement.innerHTML = `<span class="sender">${message.sender}:</span> <span class="text">${message.text}</span>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function receiveMessages() {
    db.collection('messages').orderBy('timestamp')
        .onSnapshot((snapshot) => {
            chatBox.innerHTML = '';
            snapshot.forEach((doc) => {
                displayMessage(doc.data());
            });
        });
}

// Start receiving messages
receiveMessages();
