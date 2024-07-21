const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');

// Get the page title to use as the sender's name
const senderName = document.title;

function sendMessage() {
    const message = messageInput.value;
    if (message) {
        postMessage(message, senderName);
        messageInput.value = '';
    }
}

function postMessage(message, username) {
    db.collection('messages').add({
        text: message,
        username: username,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log('Message sent:', message);
    }).catch((error) => {
        console.error('Error sending message:', error);
    });
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    const timestamp = message.timestamp ? message.timestamp.toDate().toLocaleTimeString() : '...';
    messageElement.innerHTML = `<div class="sender">${message.username}</div>
                                <div class="timestamp">${timestamp}</div>
                                <div class="text">${message.text}</div>`;
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
