const API_URL = "https://ograhul-network-attack-detection.hf.space/predict";

const form = document.getElementById("predictionForm");
const resultArea = document.getElementById("resultArea");
const themeBtn = document.getElementById("themeBtn");

document.body.classList.add("dark");

// ================= THEME TOGGLE =================
themeBtn.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        themeBtn.innerText = "☀ Light Mode";
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        themeBtn.innerText = "🌙 Dark Mode";
    }
});

// ================= FORM SUBMIT =================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    resultArea.innerHTML = "<p>Analyzing traffic...</p>";

    const data = {
        conn_state_REJ: document.getElementById("conn_state_REJ").checked,
        src_bytes: Number(document.getElementById("src_bytes").value),
        src_ip_bytes: Number(document.getElementById("src_ip_bytes").value),
        dst_port: Number(document.getElementById("dst_port").value),
        src_pkts: Number(document.getElementById("src_pkts").value),
        conn_state_SH: document.getElementById("conn_state_SH").checked
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Server Error");

        const result = await response.json();
        const confidence = (result.confidence * 100).toFixed(2);

        let severityClass = "severity-low";
        if (confidence > 70) severityClass = "severity-high";
        else if (confidence > 40) severityClass = "severity-medium";

        resultArea.innerHTML = `
            <h3>Attack Type: ${result.attack_type}</h3>
            <p>Encoded Label: ${result.encoded_prediction}</p>
            <div class="progress-bar">
                <div class="progress-fill ${severityClass}" 
                     style="width:${confidence}%"></div>
            </div>
            <p>Confidence: ${confidence}%</p>
        `;

        form.reset();

    } catch (error) {
        resultArea.innerHTML = `<p style="color:red;">Backend connection error</p>`;
    }
});
