/* Setup */

const calculateBtn = document.getElementById("calculateBtn");
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");
let bmiChart = null;

if (!user || !token) {
    alert("Please login first.");
    location.href = "login.html";
}

loadLatestBMI();
loadBMIHistory();


/* Latest BMI */

async function loadLatestBMI() {
    try {
        const res = await fetch("/api/bmi/latest", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return;

        const data = await res.json();

        if (!res.ok) return console.error(data.message);

        document.getElementById("bmiValue").textContent =
            `BMI : ${Number(data.bmi).toFixed(2)}`;

        document.getElementById("bmiStatus").textContent =
            `Status : ${data.status}`;

    } catch (error) {
        console.error("Load BMI Error:", error);
    }
}


/* Calculate BMI */

calculateBtn.addEventListener("click", async () => {

    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    if (!height || !weight || height < 30 || height > 250 ||
        weight < 2 || weight > 300) {
        alert("Enter valid height (30-250 cm) and weight (2-300 kg).");
        return;
    }

    const bmi = weight / ((height / 100) ** 2);

    const status = bmi < 18.5 ? "Underweight" :
        bmi < 25 ? "Normal Weight" :
            bmi < 30 ? "Overweight" : "Obese";

    document.getElementById("bmiValue").textContent =
        `BMI : ${bmi.toFixed(2)}`;

    document.getElementById("bmiStatus").textContent =
        `Status : ${status}`;

    try {

        const res = await fetch("/api/bmi/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                height,
                weight,
                bmi: Number(bmi.toFixed(2)),
                status
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("BMI calculated and saved successfully!");
            loadBMIHistory();
        } else {
            alert(data.message || "Unable to save BMI.");
        }

    } catch (error) {
        console.error("BMI Error:", error);
        alert("Unable to save BMI.");
    }
});


/* BMI History */

async function loadBMIHistory() {

    const container = document.getElementById("bmiHistory");
    if (!container) return;

    try {

        const res = await fetch("/api/bmi/history", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
            container.textContent = data.message || "Unable to load history.";
            return;
        }

        container.textContent = "";

        if (!data.length) {
            container.textContent = "No BMI records found.";
            updateBMIChart([]);
            return;
        }

        data.forEach(record => {

            const item = document.createElement("div");
            item.className = "bmi-history-item";

            const date = new Date(record.createdAt)
                .toLocaleDateString("en-IN");

            const dateText = document.createElement("p");
            dateText.textContent = `Date: ${date}`;

            const heightText = document.createElement("p");
            heightText.textContent = `Height: ${record.height} cm`;

            const weightText = document.createElement("p");
            weightText.textContent = `Weight: ${record.weight} kg`;

            const bmiText = document.createElement("p");
            bmiText.textContent = `BMI: ${Number(record.bmi).toFixed(2)}`;

            const statusText = document.createElement("p");
            statusText.textContent = `Status: ${record.status}`;

            statusText.className =
                record.status === "Underweight" ? "status-underweight" :
                    record.status === "Normal Weight" ? "status-normal" :
                        record.status === "Overweight" ? "status-overweight" :
                            "status-obese";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑️ Delete";
            deleteBtn.className = "delete-bmi-btn";

            deleteBtn.onclick = async () => {

                if (!confirm("Delete this BMI record?")) return;

                try {

                    const res = await fetch(`/api/bmi/delete/${record._id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const result = await res.json();

                    if (!res.ok) {
                        alert(result.message || "Unable to delete record.");
                        return;
                    }

                    alert("BMI record deleted successfully!");
                    loadBMIHistory();
                    loadLatestBMI();

                } catch (error) {
                    console.error("Delete BMI Error:", error);
                    alert("Unable to delete BMI record.");
                }
            };

            item.append(
                dateText,
                heightText,
                weightText,
                bmiText,
                statusText,
                deleteBtn
            );

            container.appendChild(item);
        });

        updateBMIChart(data);

    } catch (error) {
        console.error("BMI History Error:", error);
        container.textContent = "Unable to load BMI history.";
    }
}


/* BMI Chart */

function updateBMIChart(data) {

    const canvas = document.getElementById("bmiChart");
    if (!canvas) return;

    if (bmiChart) bmiChart.destroy();
    if (!data.length) return;

    const records = [...data].reverse();

    bmiChart = new Chart(canvas, {
        type: "line",

        data: {
            labels: records.map(r =>
                new Date(r.createdAt).toLocaleDateString("en-IN")
            ),

            datasets: [{
                label: "BMI",
                data: records.map(r => Number(r.bmi)),
                borderWidth: 2,
                tension: 0.3,
                fill: false,
                pointRadius: 5
            }]
        },

        options: {
            responsive: true,

            scales: {
                y: {
                    title: {
                        display: true,
                        text: "BMI"
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: "Date"
                    }
                }
            }
        }
    });
}