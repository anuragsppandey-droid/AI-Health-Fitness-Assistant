/* Setup */

const healthForm = document.getElementById("healthForm");
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");
let editingRecordId = null;


/* Check Login */

if (!user || !token) {
    alert("Please login first.");
    location.href = "login.html";
}


/* Load Records */

loadRecords();

async function loadRecords() {

    try {
        const response = await fetch("/api/health/record", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        const details = document.getElementById("recordDetails");

        if (!response.ok) {
            throw new Error(data.message || "Unable to load health records");
        }

        details.innerHTML = "";

        if (!data.length) {
            details.innerHTML = "<p>No health records added yet.</p>";
            return;
        }

        data.forEach(record => displayRecord(record));

    } catch (error) {

        console.error("Load Records Error:", error);

        document.getElementById("recordDetails").textContent =
            "Unable to load health records.";
    }
}


/* Display Record */

function displayRecord(record) {

    const details = document.getElementById("recordDetails");
    const item = document.createElement("div");

    item.className = "health-record-item";

    const date = new Date(record.createdAt)
        .toLocaleDateString("en-IN");

    const title = document.createElement("h3");
    title.textContent = `📅 Record Date: ${date}`;
    item.appendChild(title);

    const fields = [
        ["Age", record.age],
        ["Gender", record.gender],
        ["Blood Group", record.bloodGroup || "Not provided"],
        ["Height", record.height ? `${record.height} cm` : "Not provided"],
        ["Weight", record.weight ? `${record.weight} kg` : "Not provided"],
        ["Medical Conditions", record.medicalConditions || "None"],
        ["Allergies", record.allergies || "None"],
        ["Medications", record.medications || "None"]
    ];

    fields.forEach(([label, value]) => {

        const p = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;
        p.append(strong, document.createTextNode(value));

        item.appendChild(p);
    });

    const buttons = document.createElement("div");
    buttons.className = "record-buttons";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Edit";
    editBtn.className = "edit-record-btn";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Delete";
    deleteBtn.className = "delete-record-btn";


    /* Edit Record */

    editBtn.addEventListener("click", () => {

        editingRecordId = record._id;
        fillForm(record);

        const age = document.getElementById("age");

        age.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        age.focus();

        healthForm.querySelector("button[type='submit']")
            .textContent = "Update Health Record";
    });


    /* Delete Record */

    deleteBtn.addEventListener("click", () => {
        deleteRecord(record._id);
    });

    buttons.append(editBtn, deleteBtn);
    item.appendChild(buttons);
    details.appendChild(item);
}


/* Fill Edit Form */

function fillForm(record) {

    document.getElementById("age").value = record.age || "";
    document.getElementById("gender").value = record.gender || "";
    document.getElementById("bloodGroup").value = record.bloodGroup || "";
    document.getElementById("height").value = record.height || "";
    document.getElementById("weight").value = record.weight || "";

    document.getElementById("medicalConditions").value =
        record.medicalConditions || "";

    document.getElementById("allergies").value =
        record.allergies || "";

    document.getElementById("medications").value =
        record.medications || "";
}


/* Save / Update Record */

healthForm.addEventListener("submit", async e => {

    e.preventDefault();

    const healthData = {
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        bloodGroup: document.getElementById("bloodGroup").value,
        height: document.getElementById("height").value,
        weight: document.getElementById("weight").value,
        medicalConditions: document.getElementById("medicalConditions").value,
        allergies: document.getElementById("allergies").value,
        medications: document.getElementById("medications").value
    };

    try {

        let response;

        if (editingRecordId) {

            healthData.recordId = editingRecordId;

            response = await fetch("/api/health/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(healthData)
            });

        } else {

            response = await fetch("/api/health/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(healthData)
            });
        }

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to save health record.");
            return;
        }

        alert(data.message || "Health record saved successfully.");

        editingRecordId = null;
        healthForm.reset();

        healthForm.querySelector("button[type='submit']")
            .textContent = "Save Health Record";

        loadRecords();

    } catch (error) {

        console.error("Health Record Error:", error);
        alert("Something went wrong.");
    }
});


/* Delete Health Record */

async function deleteRecord(recordId) {

    if (!confirm("Are you sure you want to delete this health record?")) {
        return;
    }

    try {

        const response = await fetch(`/api/health/delete/${recordId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to delete record.");
            return;
        }

        alert(data.message || "Health record deleted successfully.");

        if (editingRecordId === recordId) {

            editingRecordId = null;
            healthForm.reset();

            healthForm.querySelector("button[type='submit']")
                .textContent = "Save Health Record";
        }

        loadRecords();

    } catch (error) {

        console.error("Delete Record Error:", error);
        alert("Unable to delete health record.");
    }
}