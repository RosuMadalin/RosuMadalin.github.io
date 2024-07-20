
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

function formatLocalTime(utcDate) {
    const date = new Date(utcDate);
    return date.toLocaleString(); // Formats to local date and time
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    const timestampElement = document.createElement('span');
    timestampElement.style.fontSize = 'smaller';
    timestampElement.style.color = 'gray';

    // Convert Firestore timestamp to local time
    const localTime = formatLocalTime(message.timestamp.toDate());
    timestampElement.textContent = ` (${localTime})`;

    messageElement.textContent = message.text;
    messageElement.appendChild(timestampElement);
    chatBox.appendChild(messageElement);
    
    // Scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}
function receiveMessages() {
    db.collection('messages').orderBy('timestamp')
        .onSnapshot((snapshot) => {
            chatBox.innerHTML = '';
            snapshot.forEach((doc) => {
                const message = doc.data();
                // Convert Firestore Timestamp to JavaScript Date
                message.timestamp = message.timestamp.toDate();
                displayMessage(message);
            });
        });
}
// Start receiving messages
receiveMessages();
