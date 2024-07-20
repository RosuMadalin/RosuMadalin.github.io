
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');

function sendMessage() {
    const message = messageInput.value;
    if (message) {
        postMessage(message);
        messageInput.value = '';
    }
}

function postMessage(message) {
    const timestamp = new Date().toISOString();
    db.collection('messages').add({
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        readableTimestamp: timestamp
    }).then(() => {
        console.log('Message sent:', message);
    }).catch((error) => {
        console.error('Error sending message:', error);
    });
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    const timestampElement = document.createElement('span');
    timestampElement.style.fontSize = 'smaller';
    timestampElement.style.color = 'gray';
    timestampElement.textContent = ` (${message.readableTimestamp})`;
    
    messageElement.textContent = message.text;
    messageElement.appendChild(timestampElement);
    chatBox.appendChild(messageElement);
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
