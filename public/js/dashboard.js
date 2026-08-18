const user = JSON.parse(localStorage.getItem("user"));


// =========================
// Check Login
// =========================

if (!user) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// =========================
// Welcome User
// =========================

const welcomeUser = document.getElementById("welcomeUser");

if (user.name) {

    welcomeUser.textContent = `Welcome, ${user.name}`;

} else if (user.username) {

    welcomeUser.textContent = `Welcome, ${user.username}`;

} else {

    welcomeUser.textContent = "Welcome";

}


// =========================
// Logout
// =========================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("user");

    window.location.href = "login.html";

});


// =========================
// Get Latest BMI
// =========================

async function loadBMI() {

    try {

        const response = await fetch(
            `/api/bmi/user/${user.id}`
        );


        if (!response.ok) {

            throw new Error("Unable to load BMI");

        }


        const data = await response.json();


        const bmiValue = document.getElementById("bmiValue");

        const bmiStatus = document.getElementById("bmiStatus");


        if (data && data.bmi) {

            bmiValue.textContent = data.bmi;

            bmiStatus.textContent =
                data.status || "BMI calculated";

        } else {

            bmiValue.textContent = "--";

            bmiStatus.textContent =
                "No BMI calculated";

        }


    } catch (error) {

        console.error("BMI Error:", error);

    }

}


// =========================
// Get Health Record
// =========================

async function loadHealthRecord() {

    try {

        const response = await fetch(
             `/api/health/record/${user.id}`
         );


        if (!response.ok) {

            throw new Error("Unable to load health record");

        }


        const data = await response.json();


        const recordStatus =
            document.getElementById("recordStatus");


        if (data) {

            recordStatus.textContent = "Available";

        } else {

            recordStatus.textContent = "Not Added";

        }


    } catch (error) {

        console.error("Health Record Error:", error);

    }

}


// =========================
// Load Dashboard Data
// =========================

loadBMI();

loadHealthRecord();