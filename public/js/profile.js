const user = JSON.parse(localStorage.getItem("user"));


// Check Login

if (!user) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// Display Name

const profileName = document.getElementById("profileName");

if (user.name) {

    profileName.textContent = user.name;

} else if (user.username) {

    profileName.textContent = user.username;

} else {

    profileName.textContent = "User";

}


// Display Email

const profileEmail = document.getElementById("profileEmail");

if (user.email) {

    profileEmail.textContent = user.email;

} else {

    profileEmail.textContent = "Not available";

}


// Logout

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("user");

    window.location.href = "login.html";

});