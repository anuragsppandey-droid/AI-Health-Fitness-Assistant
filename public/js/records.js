const healthForm = document.getElementById("healthForm");

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// Load existing record when page opens
loadRecord();


async function loadRecord() {

    try {

        const response = await fetch(
            `/api/health/record/${user.id}`
        );

        if (!response.ok) {

            return;

        }

        const record = await response.json();

        displayRecord(record);

        fillForm(record);

    } catch (error) {

        console.error(error);

    }

}


// Display record
function displayRecord(record) {

    document.getElementById("recordDetails").innerHTML = `

        <p><strong>Age:</strong> ${record.age}</p>

        <p><strong>Gender:</strong> ${record.gender}</p>

        <p><strong>Blood Group:</strong> ${record.bloodGroup || "Not provided"}</p>

        <p><strong>Height:</strong> ${record.height || "Not provided"} cm</p>

        <p><strong>Weight:</strong> ${record.weight || "Not provided"} kg</p>

        <p><strong>Medical Conditions:</strong>
        ${record.medicalConditions || "None"}</p>

        <p><strong>Allergies:</strong>
        ${record.allergies || "None"}</p>

        <p><strong>Medications:</strong>
        ${record.medications || "None"}</p>

    `;

}


// Fill form with existing data
function fillForm(record) {

    document.getElementById("age").value = record.age;

    document.getElementById("gender").value = record.gender;

    document.getElementById("bloodGroup").value =
        record.bloodGroup || "";

    document.getElementById("height").value =
        record.height || "";

    document.getElementById("weight").value =
        record.weight || "";

    document.getElementById("medicalConditions").value =
        record.medicalConditions || "";

    document.getElementById("allergies").value =
        record.allergies || "";

    document.getElementById("medications").value =
        record.medications || "";

}


// Save / Update
healthForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const healthData = {

        userId: user.id,

        age: document.getElementById("age").value,

        gender: document.getElementById("gender").value,

        bloodGroup:
            document.getElementById("bloodGroup").value,

        height:
            document.getElementById("height").value,

        weight:
            document.getElementById("weight").value,

        medicalConditions:
            document.getElementById("medicalConditions").value,

        allergies:
            document.getElementById("allergies").value,

        medications:
            document.getElementById("medications").value

    };


    try {

        const response = await fetch(
            `/api/health/update/${user.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(healthData)
            }
        );


        const data = await response.json();


        // If record doesn't exist, create it
        if (response.status === 404) {

            const createResponse = await fetch(
                "/api/health/save",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(healthData)
                }
            );

            const createData = await createResponse.json();

            alert(createData.message);

        } else {

            alert(data.message);

        }


        loadRecord();

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

});
// Edit button
document.getElementById("editBtn").addEventListener(
    "click",
    () => {

        document.getElementById("age").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        document.getElementById("age").focus();

    }
);

// Delete
document.getElementById("deleteBtn").addEventListener(
    "click",
    async () => {

        const confirmDelete = confirm(
            "Are you sure you want to delete your health record?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `/api/health/delete/${user.id}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();

            alert(data.message);

            if (response.ok) {

                healthForm.reset();

                document.getElementById(
                    "recordDetails"
                ).innerHTML = "";

            }

        } catch (error) {

            console.error(error);

            alert("Unable to delete record.");

        }

    }
);