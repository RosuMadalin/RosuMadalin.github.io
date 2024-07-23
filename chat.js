const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const mediaInput = document.getElementById('media-input');

// Get the page title to use as the sender's name
const senderName = document.title;

function sendMessage() {
    const message = messageInput.value;
    if (message) {
        postMessage(message, senderName);
        messageInput.value = '';
    }
}

function postMessage(message, username, mediaURL = null, mediaType = null) {
    db.collection('messages').add({
        text: message,
        username: username,
        mediaURL: mediaURL,
        mediaType: mediaType,
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

    if (message.mediaURL) {
        if (message.mediaType.startsWith('image/')) {
            messageElement.innerHTML += `<div class="media"><img src="${message.mediaURL}" alt="Image" style="max-width: 100%;"></div>`;
        } else if (message.mediaType.startsWith('video/')) {
            messageElement.innerHTML += `<div class="media"><video controls style="max-width: 100%;"><source src="${message.mediaURL}" type="${message.mediaType}"></video></div>`;
        }
    }

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

function uploadMedia() {
    const file = mediaInput.files[0];
    if (file) {
        const storageRef = storage.ref();
        const fileRef = storageRef.child('media/' + file.name);
        
        fileRef.put(file).then(() => {
            fileRef.getDownloadURL().then((url) => {
                postMessage('Media uploaded', senderName, url, file.type);
            });
        }).catch((error) => {
            console.error('Error uploading file:', error);
        });
    }
}

// Start receiving messages
receiveMessages();
