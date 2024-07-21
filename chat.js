const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const usernameInput = document.getElementById('username');

function sendMessage() {
    const message = messageInput.value;
    const username = usernameInput.value.trim() || 'Anonymous';
    if (message) {
        postMessage(message, username);
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
    const timestamp = message.timestamp ? message.timestamp.toDate().toLocaleTimeString() : '...';
    messageElement.innerHTML = `<strong>${message.username}</strong> [${timestamp}]: ${message.text}`;
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
