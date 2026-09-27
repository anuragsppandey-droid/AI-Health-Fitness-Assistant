/* Setup */

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (!user || !token) {
    alert("Please login first.");
    window.location.href = "login.html";
}

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("message");
const chatBox = document.getElementById("chatBox");
const sendButton = chatForm.querySelector("button");


/* Chat */

chatForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    // User Message
    const userMessage = document.createElement("div");
    userMessage.className = "message user-message";

    const userLabel = document.createElement("strong");
    userLabel.textContent = "You";

    const userText = document.createElement("p");
    userText.textContent = message;

    userMessage.append(userLabel, userText);
    chatBox.appendChild(userMessage);

    messageInput.value = "";

    // AI Message
    const aiMessage = document.createElement("div");
    aiMessage.className = "message ai-message";

    const aiLabel = document.createElement("strong");
    aiLabel.textContent = "AI Health Coach";

    const aiResponse = document.createElement("div");
    aiResponse.className = "ai-response";
    aiResponse.textContent = "Thinking... 🤔";

    aiMessage.append(aiLabel, aiResponse);
    chatBox.appendChild(aiMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    // Disable Send
    sendButton.disabled = true;
    sendButton.textContent = "Sending...";

    try {

        // Send Request
        const response = await fetch("/api/chat/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ message })
        });

        // Handle Error
        if (!response.ok) {

            let errorMessage = "Unable to get response from AI.";

            try {
                const data = await response.json();
                errorMessage = data.message || errorMessage;
            } catch (error) {
                console.error("Error reading error response:", error);
            }

            aiResponse.textContent = errorMessage;
            return;
        }

        // AI Response
        const aiText = await response.text();

        if (aiText) {
            aiResponse.innerHTML = formatAIResponse(aiText);
        } else {
            aiResponse.textContent = "AI could not generate a response.";
        }

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {

        console.error("Chat Error:", error);

        aiResponse.textContent =
            "Unable to connect to the AI. Please try again.";

    } finally {

        // Enable Send
        sendButton.disabled = false;
        sendButton.textContent = "Send";
        messageInput.focus();
    }
});


/* Format AI Response */

function formatAIResponse(text) {

    // Escape HTML
    let escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Fix escaped Markdown
    escaped = escaped
        .replace(/\\\*\\\*/g, "**")
        .replace(/\\\*/g, "*")
        .replace(/\\#/g, "#");

    const lines = escaped.split(/\r?\n/);
    let html = "";
    let inList = false;

    lines.forEach(line => {

        line = line.trim();

        // Empty line
        if (!line) {

            if (inList) {
                html += "</ul>";
                inList = false;
            }

            html += "<div class='ai-space'></div>";
            return;
        }

        // Horizontal line
        if (/^---+$/.test(line)) {

            if (inList) {
                html += "</ul>";
                inList = false;
            }

            html += "<hr>";
            return;
        }

        // Headings
        if (/^###\s+/.test(line)) {

            if (inList) {
                html += "</ul>";
                inList = false;
            }

            const heading = line.replace(/^###\s+/, "");
            html += `<h3>${formatBold(heading)}</h3>`;
            return;
        }

        if (/^##\s+/.test(line)) {

            if (inList) {
                html += "</ul>";
                inList = false;
            }

            const heading = line.replace(/^##\s+/, "");
            html += `<h2>${formatBold(heading)}</h2>`;
            return;
        }

        if (/^#\s+/.test(line)) {

            if (inList) {
                html += "</ul>";
                inList = false;
            }

            const heading = line.replace(/^#\s+/, "");
            html += `<h1>${formatBold(heading)}</h1>`;
            return;
        }

        // Bullet Point
        if (/^[*-]\s+/.test(line)) {

            if (!inList) {
                html += "<ul>";
                inList = true;
            }

            const item = line.replace(/^[*-]\s+/, "");
            html += `<li>${formatBold(item)}</li>`;
            return;
        }

        // Normal text
        if (inList) {
            html += "</ul>";
            inList = false;
        }

        html += `<p>${formatBold(line)}</p>`;
    });

    if (inList) {
        html += "</ul>";
    }

    return html;
}


/* Format Bold Text */

function formatBold(text) {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}