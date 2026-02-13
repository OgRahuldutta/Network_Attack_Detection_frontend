const API_URL = "https://ograhul-network-attack-detection.hf.space/predict";

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("predictionForm");
    const resultText = document.getElementById("resultText");
    const confidenceBar = document.getElementById("confidenceBar");
    const confidenceValue = document.getElementById("confidenceValue");
    const encodedLabel = document.getElementById("encodedLabel");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        resultText.innerText = "Analyzing...";
        resultText.style.color = "white";
        encodedLabel.innerText = "Encoded Label: -";
        confidenceBar.style.width = "0%";
        confidenceValue.innerText = "";

        const payload = {
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
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const result = await response.json();

            const confidencePercent = (result.confidence * 100).toFixed(2);

            resultText.innerText = `Attack Type: ${result.attack_type}`;
            encodedLabel.innerText = `Encoded Label: ${result.encoded_prediction}`;
            confidenceBar.style.width = confidencePercent + "%";
            confidenceValue.innerText = `Confidence: ${confidencePercent}%`;

            if (result.attack_type === "normal") {
                resultText.style.color = "#22c55e";
                confidenceBar.style.background = "#22c55e";
            } else {
                resultText.style.color = "#ef4444";
                confidenceBar.style.background = "#ef4444";
            }

        } catch (error) {
            resultText.innerText = "⚠ Backend connection error";
            resultText.style.color = "#ef4444";
            encodedLabel.innerText = "";
            confidenceBar.style.width = "0%";
            confidenceValue.innerText = "";
            console.error(error);
        }
    });

});
