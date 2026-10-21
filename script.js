javascript
const textInput = document.getElementById('textInput');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');

// Update real-time word and character counts
textInput.addEventListener('input', () => {
    const text = textInput.value;
    charCount.textContent = text.length;
    wordCount.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
});

// Core utility functionalities
function transformText(type) {
    let currentText = textInput.value;
    if (type === 'upper') {
        textInput.value = currentText.toUpperCase();
    } else if (type === 'lower') {
        textInput.value = currentText.toLowerCase();
    } else if (type === 'clean') {
        textInput.value = currentText.replace(/\s+/g, ' ').trim();
    }
    textInput.dispatchEvent(new Event('input')); // Force stats update
}

function copyToClipboard() {
    textInput.select();
    document.execCommand('copy');
    alert('Text copied to clipboard!');
}

function clearText() {
    textInput.value = '';
    textInput.dispatchEvent(new Event('input'));
}
