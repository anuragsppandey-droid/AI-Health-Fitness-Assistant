/* Register */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            alert(data.message);

            if (response.ok) {
                window.location.href = "login.html";
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        }
    });

}


/* Login */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            alert(data.message);

            if (response.ok) {

                // Save JWT
                localStorage.setItem("token", data.token);

                // Save user
                localStorage.setItem("user", JSON.stringify(data.user));

                window.location.href = "dashboard.html";
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        }
    });

}