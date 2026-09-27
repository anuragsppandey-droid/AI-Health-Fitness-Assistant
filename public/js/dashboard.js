/* Setup */

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

// Check Login
if (!user || !token) {
    alert("Please login first.");
    location.href = "login.html";
}


/* Welcome User */

document.getElementById("welcomeUser").textContent =
    `Welcome, ${user.name || user.username || "User"}`;


/* Logout */

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    location.href = "login.html";
});


/* Latest BMI */

async function loadBMI() {

    try {
        const res = await fetch("/api/bmi/latest", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const value = document.getElementById("bmiValue");
        const status = document.getElementById("bmiStatus");

        if (res.status === 404) {
            value.textContent = "--";
            status.textContent = "No BMI calculated";
            return;
        }

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Unable to load BMI");
        }

        value.textContent = Number(data.bmi).toFixed(2);
        status.textContent = data.status;

    } catch (error) {
        console.error("BMI Error:", error);
    }
}


/* Health Records */

async function loadHealthRecords() {

    try {
        const res = await fetch("/api/health/record", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Unable to load health records");
        }

        const recordStatus = document.getElementById("recordStatus");
        const recordText = document.getElementById("recordText");

        recordStatus.textContent = data.length;

        if (!data.length) {
            recordText.textContent = "No records added";
            return;
        }

        recordText.textContent =
            data.length === 1
                ? "Health record saved"
                : "Health records saved";

        // Latest Record
        const latest = data[0];

        document.getElementById("healthAge").textContent =
            latest.age || "--";

        document.getElementById("healthGender").textContent =
            latest.gender || "--";

        document.getElementById("healthBloodGroup").textContent =
            latest.bloodGroup || "--";

        document.getElementById("healthHeight").textContent =
            latest.height ? `${latest.height} cm` : "--";

        document.getElementById("healthWeight").textContent =
            latest.weight ? `${latest.weight} kg` : "--";

    } catch (error) {

        console.error("Health Record Error:", error);

        document.getElementById("recordStatus").textContent = "0";
        document.getElementById("recordText").textContent =
            "Unable to load records";
    }
}


/* Load Dashboard */

loadBMI();
loadHealthRecords();