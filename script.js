const textInput = document.getElementById('textInput');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');

if (textInput) {
    textInput.addEventListener('input', () => {
        const text = textInput.value;
        charCount.textContent = text.length;
        wordCount.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    });
}

// Casing adjustment calculations engine (index.html)
function convertCase(type) {
    let currentText = textInput.value;
    if (currentText.trim() === '') return;

    if (type === 'upper') {
        textInput.value = currentText.toUpperCase();
    } else if (type === 'lower') {
        textInput.value = currentText.toLowerCase();
    } else if (type === 'title') {
        textInput.value = currentText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    textInput.dispatchEvent(new Event('input'));
}

// Spacing filter logic functions (whitespace.html)
function cleanWhitespace(type) {
    let currentText = textInput.value;
    if (currentText.trim() === '') return;

    if (type === 'spaces') {
        textInput.value = currentText.replace(/[ \t]+/g, ' ').trim();
    } else if (type === 'lines') {
        textInput.value = currentText.replace(/\n\s*\n/g, '\n').trim();
    }
    textInput.dispatchEvent(new Event('input'));
}

function copyToClipboard() {
    if (textInput.value === '') return;
    textInput.select();
    document.execCommand('copy');
    alert('Text copied to clipboard safely!');
}

function clearText() {
    textInput.value = '';
    textInput.dispatchEvent(new Event('input'));
}
