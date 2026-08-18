const user = JSON.parse(localStorage.getItem("user"));

if (!user) {

    alert("Please login first.");

    window.location.href = "login.html";

}


const chatForm = document.getElementById("chatForm");

const messageInput = document.getElementById("message");

const chatBox = document.getElementById("chatBox");


chatForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const message = messageInput.value.trim();


    if (!message) {
        return;
    }


    // ==========================
    // Display User Message
    // ==========================

    const userMessage = document.createElement("div");

    userMessage.className = "message user-message";

    userMessage.innerHTML = `
        <strong>You</strong>
        <p>${message}</p>
    `;

    chatBox.appendChild(userMessage);


    // Clear input

    messageInput.value = "";


    // ==========================
    // Create AI Message
    // ==========================

    const aiMessage = document.createElement("div");

    aiMessage.className = "message ai-message";

    aiMessage.innerHTML = `
        <strong>AI Health Coach</strong>
        <p id="aiResponse">Thinking... 🤔</p>
    `;

    chatBox.appendChild(aiMessage);


    const aiResponse = aiMessage.querySelector("#aiResponse");


    chatBox.scrollTop = chatBox.scrollHeight;


    try {

        // ==========================
        // Send Request
        // ==========================

        const response = await fetch("/api/chat/message", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message,
                userId: user.id
            })

        });


        if (!response.ok) {

            let errorMessage = "Unable to get response from AI.";

            try {

                const data = await response.json();

                if (data.message) {
                    errorMessage = data.message;
                }

            } catch (error) {
                // Ignore JSON parsing error
            }

            aiResponse.textContent = errorMessage;

            return;

        }


        // ==========================
        // Read Streaming Response
        // ==========================

        const reader = response.body.getReader();

        const decoder = new TextDecoder();

        let fullResponse = "";

        let firstChunk = true;


        while (true) {

            const { value, done } = await reader.read();


            if (done) {
                break;
            }


            const chunk = decoder.decode(value, {
                stream: true
            });


            if (firstChunk) {

                aiResponse.textContent = "";

                firstChunk = false;

            }


            fullResponse += chunk;


            // Display response as it arrives

            aiResponse.innerHTML = fullResponse
                .replace(/\n/g, "<br>");


            // Automatically scroll

            chatBox.scrollTop = chatBox.scrollHeight;

        }


    } catch (error) {

        console.error("Chat Error:", error);

        aiResponse.textContent =
            "Unable to connect to the AI. Please try again.";

    }

});