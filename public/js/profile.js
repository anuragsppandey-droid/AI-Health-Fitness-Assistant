/* Setup */

const user = JSON.parse(localStorage.getItem("user"));


/* Check Login */

if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
}


/* Display Profile */

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

profileName.textContent = user.name || user.username || "User";
profileEmail.textContent = user.email || "Not available";


/* Logout */

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
});