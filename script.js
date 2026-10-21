document.addEventListener("DOMContentLoaded", () => {
    const inputArea = document.getElementById("input-text");
    const outputArea = document.getElementById("output-text");
    const wordCountElement = document.getElementById("word-count");
    const charCountElement = document.getElementById("char-count");
    const copyButton = document.getElementById("copy-btn");
    const clearButton = document.getElementById("clear-btn");
    const modeButtons = document.querySelectorAll(".case-btn");

    let currentFormatMode = "lowercase";

    // Live Processing Loop
    inputArea.addEventListener("input", () => {
        processText();
    });

    // Option Toggles
    modeButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            modeButtons.forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
            currentFormatMode = e.target.dataset.case;
            processText();
        });
    });

    // Clear Workspace Function
    clearButton.addEventListener("click", () => {
        inputArea.value = "";
        outputArea.value = "";
        updateMetrics("");
    });

    // Copy Utility
    copyButton.addEventListener("click", () => {
        if (!outputArea.value) return;
        navigator.clipboard.writeText(outputArea.value).then(() => {
            const defaultText = copyButton.textContent;
            copyButton.textContent = "Copied! ✓";
            copyButton.style.backgroundColor = "var(--success)";
            setTimeout(() => {
                copyButton.textContent = defaultText;
                copyButton.style.backgroundColor = "";
            }, 1800);
        });
    });

    // String Pipeline
    function processText() {
        const value = inputArea.value;
        updateMetrics(value);

        if (!value) {
            outputArea.value = "";
            return;
        }

        switch (currentFormatMode) {
            case "lowercase":
                outputArea.value = value.toLowerCase();
                break;
            case "uppercase":
                outputArea.value = value.toUpperCase();
                break;
            case "title":
                outputArea.value = value.replace(/\b[a-z]/gi, char => char.toUpperCase());
                break;
            case "sentence":
                outputArea.value = value.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, char => char.toUpperCase());
                break;
            case "capitalize":
                outputArea.value = value.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
                break;
            case "camel":
                outputArea.value = toWordsArray(value).map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
                break;
            case "pascal":
                outputArea.value = toWordsArray(value).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
                break;
            case "snake":
                outputArea.value = toWordsArray(value).map(word => word.toLowerCase()).join("_");
                break;
            case "kebab":
                outputArea.value = toWordsArray(value).map(word => word.toLowerCase()).join("-");
                break;
            default:
                outputArea.value = value;
        }
    }

    function toWordsArray(str) {
        return str.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/).filter(Boolean);
    }

    function updateMetrics(text) {
        charCountElement.textContent = text.length;
        const words = text.trim().split(/\s+/).filter(Boolean);
        wordCountElement.textContent = words.length;
    }
});
