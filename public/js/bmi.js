const calculateBtn = document.getElementById("calculateBtn");

calculateBtn.addEventListener("click", async () => {

    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    if (!height || !weight || height <= 0 || weight <= 0) {
        alert("Please enter valid height and weight.");
        return;
    }

    // Calculate BMI
    const bmi = weight / ((height / 100) * (height / 100));

    let status = "";

    if (bmi < 18.5) {
        status = "Underweight";
    } 
    else if (bmi < 25) {
        status = "Normal Weight";
    } 
    else if (bmi < 30) {
        status = "Overweight";
    } 
    else {
        status = "Obese";
    }

    // Display result
    document.getElementById("bmiValue").innerHTML =
        `BMI : ${bmi.toFixed(2)}`;

    document.getElementById("bmiStatus").innerHTML =
        `Status : ${status}`;

    // Get logged-in user
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        // Save BMI to MongoDB
        const response = await fetch("/api/bmi/save", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                userId: user.id,
                height: height,
                weight: weight,
                bmi: Number(bmi.toFixed(2)),
                status: status
            })

        });

        const data = await response.json();

        if (response.ok) {
            alert("BMI calculated and saved successfully!");
        } 
        else {
            alert(data.message);
        }

    } catch (error) {

        console.error("BMI Error:", error);

        alert("Unable to save BMI.");

    }

});