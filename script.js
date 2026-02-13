const API_URL = "https://ograhul-network-attack-detection.hf.space/predict";

const form = document.getElementById("predictionForm");
const resultArea = document.getElementById("resultArea");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    resultArea.innerHTML = "<p>Analyzing traffic...</p>";

    const data = {
        conn_state_REJ: document.getElementById("conn_state_REJ").checked,
        src_bytes: parseFloat(document.getElementById("src_bytes").value),
        src_ip_bytes: parseFloat(document.getElementById("src_ip_bytes").value),
        dst_port: parseInt(document.getElementById("dst_port").value),
        src_pkts: parseFloat(document.getElementById("src_pkts").value),
        conn_state_SH: document.getElementById("conn_state_SH").checked
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const result = await response.json();

        const confidencePercent = (result.confidence * 100).toFixed(2);

        resultArea.innerHTML = `
            <div class="result-attack">
                Attack Type: ${result.attack_type}
            </div>
            <div class="result-encoded">
                Encoded Label: ${result.encoded_prediction}
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${confidencePercent}%"></div>
            </div>
            <p>Confidence: ${confidencePercent}%</p>
        `;

        // Reset form after success
        form.reset();

    } catch (error) {
        resultArea.innerHTML = `
            <p style="color:red;">Backend connection error</p>
        `;
    }
});
