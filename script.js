// ✅ Import Firebase Modules (At Top Level)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    signInAnonymously, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxyqXcx-Uc9O-Pyp0OEQTDtkB9aXBgPls",
  authDomain: "adychat-18084.firebaseapp.com",
  projectId: "adychat-18084",
  storageBucket: "adychat-18084.firebasestorage.app",
  messagingSenderId: "620921358718",
  appId: "1:620921358718:web:52aa1a4d489a7510218b2f"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Function to Handle Google Login
// ✅ Google Login (Using Pop-up)
function googleLogin() {
    signInWithPopup(auth, provider) // 👈 Using Pop-up instead of Redirect
        .then((result) => {
            const user = result.user;
            localStorage.setItem("username", user.displayName.split(" ")[0]); // First Name as Username
            localStorage.setItem("avatar", user.photoURL);
            window.location.href = "main.html"; // ✅ Redirect to Chat Page manually
        })
        .catch((error) => {
            console.error("Login Error:", error);
            alert("Login Failed! Try Again.");
        });
}


// ✅ Anonymous Login (User Chooses Username & Avatar)
function anonymousLogin() {
    signInAnonymously(auth)
        .then(() => {
            let username = prompt("Enter a username:");
            

            if (!username) username = "Guest"; // Default name
            

            localStorage.setItem("username", username);
            
            
            window.location.href = "main.html"; // ✅ Redirect to Chat Page
        })
        .catch((error) => {
            console.error("Anonymous Login Error:", error);
            alert("Login Failed! Try Again.");
        });
}

// ✅ Function to Handle Logout
function googleLogout() {
    signOut(auth).then(() => {
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
        window.location.href = "index.html"; // Redirect to Login Page
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// ✅ Wait for DOM to Load
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("google-login-btn");
    const logoutButton = document.getElementById("logout-btn");

    if (loginButton) {
        loginButton.addEventListener("click", googleLogin);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", googleLogout);
    }

    // ✅ Auto-fill user details on Chat Page (main.html)
    if (window.location.pathname.includes("main.html")) {
        const username = localStorage.getItem("username");
        const avatar = localStorage.getItem("avatar");

        const userNameElement = document.getElementById("user-name");
        const userAvatarElement = document.getElementById("user-avatar");

        if (username && avatar && userNameElement && userAvatarElement) {
            userNameElement.textContent = username;
            userAvatarElement.src = avatar;
        }
    }
});

// ✅ Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("google-login-btn");
    const anonLoginButton = document.getElementById("anonymous-login-btn"); // New Button
    const logoutButton = document.getElementById("logout-btn");

    if (loginButton) loginButton.addEventListener("click", googleLogin);
    if (anonLoginButton) anonLoginButton.addEventListener("click", anonymousLogin); // New Button
    if (logoutButton) logoutButton.addEventListener("click", googleLogout);
});
