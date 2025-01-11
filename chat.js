const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const mediaInput = document.getElementById("media-input");
const fileNameDisplay = document.getElementById("file-name");

// Get the page title to use as the sender's name
const senderName = document.title;

// Put the name of the file, next to the SEND button
mediaInput.addEventListener("change", () => {
  if (mediaInput.files.length > 0) {
    fileNameDisplay.textContent = mediaInput.files[0].name;
  } else {
    fileNameDisplay.textContent = ""; // Clear the text if no file is selected
  }
});

function sendMessage() {
  const message = messageInput.value;
  const file = mediaInput.files[0];
  console.log("File selected:", file);
  if (message || file) {
    if (file) {
      uploadMedia(file)
        .then((url) => {
          postMessage(message, senderName, url, file.type);
          mediaInput.value = "";
          fileNameDisplay.textContent = ""; // Clear the displayed file name
        })
        .catch((error) => {
          console.error("Error uploading media:", error);
        });
    } else {
      postMessage(message, senderName);
    }
    messageInput.value = "";
  }
}

function postMessage(message, username, mediaURL = null, mediaType = null) {
  db.collection("messages")
    .add({
      text: message,
      username: username,
      mediaURL: mediaURL,
      mediaType: mediaType,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log("Message sent:", message);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}

// Autentificare firebase pentru files
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Error during anonymous sign-in:", error);
  });

function displayMessage(doc) {
  const message = doc.data();
  const messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.classList.add(
    message.username === senderName ? "sent" : "received"
  );

  if (message.mediaURL) {
    messageElement.classList.add("media-message"); // Add class for media messages

    if (message.mediaType.startsWith("image/")) {
      messageElement.innerHTML = `<div class="media"><img src="${message.mediaURL}" alt="Image"></div>`;
    } else if (message.mediaType.startsWith("video/")) {
      messageElement.innerHTML = `<div class="media"><video controls><source src="${message.mediaURL}" type="${message.mediaType}"></video></div>`;
    }
  } else {
    const timestamp = message.timestamp
      ? message.timestamp.toDate().toLocaleTimeString()
      : "...";
    messageElement.innerHTML = `<div class="sender">${message.username}</div>
                                    <div class="timestamp">${timestamp}</div>
                                    <div class="text">${message.text}</div>`;
  }

  // Handle right-click event
  messageElement.oncontextmenu = (e) => {
    e.preventDefault();
    if (confirm("Do you want to delete this message?")) {
      deleteMessage(doc.id);
    }
  };

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function receiveMessages() {
  db.collection("messages")
    .orderBy("timestamp")
    .onSnapshot((snapshot) => {
      chatBox.innerHTML = "";
      snapshot.forEach((doc) => {
        displayMessage(doc);
      });
    });
}

function deleteMessage(messageId) {
  db.collection("messages")
    .doc(messageId)
    .delete()
    .then(() => {
      console.log("Message deleted:", messageId);
    })
    .catch((error) => {
      console.error("Error deleting message:", error);
    });
}

function uploadMedia(file) {
  const storageRef = storage.ref();
  const fileRef = storageRef.child("media/" + file.name);

  console.log("Uploading file:", file.name); // Debugging line

  return fileRef.put(file).then(() => {
    console.log("File uploaded successfully");
    return fileRef.getDownloadURL();
  }).catch((error) => {
    console.error("Error uploading media:", error);
    throw error; // Propagate error for proper handling
  });
}

// Start receiving messages
receiveMessages();
