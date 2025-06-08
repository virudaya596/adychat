// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxyqXcx-Uc9O-Pyp0OEQTDtkB9aXBgPls",
  authDomain: "adychat-18084.firebaseapp.com",
  projectId: "adychat-18084",
  messagingSenderId: "620921358718",
  appId: "1:620921358718:web:52aa1a4d489a7510218b2f"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    getToken(messaging, {
      vapidKey: "BBPqGTDdaSucSdZx4pcTe_bL-pRsDcDrC26pHrK-jHjh7RXLmkGcCVYcrceDNqtjpSGZc7I55ZjAcF_IOwVMTts"
    }).then((token) => {
      console.log("🔐 FCM Token:", token);
      // You can save this token to your Firestore users collection
    });
  } else {
    console.warn("❌ Notification permission denied");
  }
}).catch((err) => {
  console.error("😢 Error while getting permission:", err);
});

onMessage(messaging, (payload) => {
  alert(`📨 New Message: ${payload.notification.title}\n${payload.notification.body}`);
});

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();
const messagesRef = ref(db, "messages"); // ✅ Database Reference

// ✅ Function to Send a Message
function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (message !== "") {
        push(messagesRef, {
            username: localStorage.getItem("username"),
            avatar: localStorage.getItem("avatar"),
            text: message,
            timestamp: Date.now(),
            uid: auth.currentUser.uid
        });

        messageInput.value = ""; // ✅ Clear input after sending
    }
}

// ✅ Function to Display Messages (WhatsApp Style)
function displayMessage(data) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");

    // ✅ Create avatar image
    const userAvatar = document.createElement("img");
    userAvatar.src = data.avatar;
    userAvatar.classList.add("avatar");

    // ✅ Create username span
    const usernameSpan = document.createElement("span");
    usernameSpan.textContent = ` ${data.username}: `;
    usernameSpan.classList.add("username");

    // ✅ Create message text
    const messageText = document.createElement("span");
    messageText.textContent = data.text;
    messageText.classList.add("message-text");

    // ✅ Apply proper message alignment
    messageDiv.classList.add("message");

    // ✅ Check if it's the current user's message
    if (data.uid === auth.currentUser.uid) {
        messageDiv.classList.add("sent-message");
    } else {
        messageDiv.classList.add("received-message");
    }

    messageDiv.appendChild(userAvatar);
    messageDiv.appendChild(usernameSpan);
    messageDiv.appendChild(messageText);
    chatBox.appendChild(messageDiv);

    // ✅ Auto-scroll to latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ✅ Listen for New Messages
onChildAdded(messagesRef, (snapshot) => {
    displayMessage(snapshot.val());
});

// ✅ Google Login
function googleLogin() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            localStorage.setItem("username", user.displayName.split(" ")[0]); // First Name as Username
            localStorage.setItem("avatar", user.photoURL);
            window.location.href = "main.html"; // ✅ Redirect to Chat Page
        })
        .catch((error) => {
            console.error("Login Error:", error);
            alert("Login Failed! Try Again.");
        });
}

// ✅ Google Logout
function googleLogout() {
    signOut(auth).then(() => {
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
        window.location.href = "index.html"; // ✅ Redirect to Login Page
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// ✅ Auto-fill user details in Chat Page (main.html)
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("user-name").textContent = localStorage.getItem("username");
        document.getElementById("user-avatar").src = localStorage.getItem("avatar");
    } else {
        window.location.href = "index.html"; // ✅ Redirect if not logged in
    }
});

// ✅ Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("google-login-btn");
    const logoutButton = document.getElementById("logout-btn");
    const sendButton = document.getElementById("send-btn");
    const messageInput = document.getElementById("message-input");

    if (loginButton) loginButton.addEventListener("click", googleLogin);
    if (logoutButton) logoutButton.addEventListener("click", googleLogout);
    if (sendButton) sendButton.addEventListener("click", sendMessage);

    // ✅ Send message on Enter key press
    messageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
